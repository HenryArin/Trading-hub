class PostsController < ApplicationController
  before_action :authorize_user, only: [ :create, :destroy ]

  def index
    posts = Post.all.order(created_at: :desc)
    render json: posts
  end

  def create
    post = Post.new(post_params)
    post.user_id = @current_user.id  # Associate post with logged-in user

    if post.save
      render json: post, status: :created
    else
      render json: { error: "Failed to create post", messages: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    post = Post.find_by(id: params[:id])

    if post.nil?
      render json: { error: "Post not found" }, status: :not_found
      return
    end

    if @is_admin || post.user_id == @current_user.id
      # ✅ Delete all comments associated with the post
      post.comments.destroy_all

      # ✅ Now delete the post
      post.destroy
      render json: { message: "Post and associated comments deleted successfully" }, status: :ok
    else
      render json: { error: "Unauthorized: You can only delete your own posts" }, status: :unauthorized
    end
  end


  private

  def authorize_user
    token = request.headers["Authorization"]
    token = token.split(" ").last if token&.start_with?("Bearer")  # Extract token

    decoded_token = decode_token(token)

    if decoded_token.nil? || !decoded_token["user_id"]
      Rails.logger.info "Unauthorized Request: Invalid or Expired Token"
      render json: { error: "Unauthorized" }, status: :unauthorized
    else
      @current_user = User.find_by(id: decoded_token["user_id"])
      @is_admin = decoded_token["admin"] || false  # ✅ Ensure @is_admin is always set
    end
  end

  def post_params
    params.permit(:card_name, :description)
  end

  def decode_token(token)
    return nil unless token
    begin
      decoded = JWT.decode(token, ENV["JWT_SECRET_KEY"], true, algorithm: "HS256").first
      decoded if decoded["exp"].nil? || decoded["exp"] > Time.now.to_i  # Ensure token is valid
    rescue JWT::DecodeError
      nil
    end
  end
end
