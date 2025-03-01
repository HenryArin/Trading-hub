class CommentsController < ApplicationController
    before_action :authorize_user, only: [ :create, :destroy ]

    def index
      comments = Comment.where(post_id: params[:post_id]).order(created_at: :asc)
      render json: comments
    end

    def create
      comment = Comment.new(comment_params)
      comment.user_id = @current_user.id

      if comment.save
        render json: comment, status: :created
      else
        render json: { error: "Failed to create comment", messages: comment.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      comment = Comment.find_by(id: params[:id])

      if comment.nil?
        render json: { error: "Comment not found" }, status: :not_found
        return
      end

      if comment.user_id != @current_user.id
        render json: { error: "Unauthorized to delete this comment" }, status: :forbidden
        return
      end

      comment.destroy
      render json: { message: "Comment deleted successfully" }, status: :ok
    end

    private

    def comment_params
      params.require(:comment).permit(:content, :post_id) # ✅ Allow `post_id`
    end


    def authorize_user
      token = request.headers["Authorization"]
      token = token.split(" ").last if token&.start_with?("Bearer")

      decoded_token = decode_token(token)

      if decoded_token.nil? || !decoded_token["user_id"]
        render json: { error: "Unauthorized" }, status: :unauthorized
      else
        @current_user = User.find_by(id: decoded_token["user_id"])
      end
    end

    def decode_token(token)
      return nil unless token

      begin
        decoded = JWT.decode(token, ENV["JWT_SECRET_KEY"], true, algorithm: "HS256").first
        decoded if decoded["exp"].nil? || decoded["exp"] > Time.now.to_i
      rescue JWT::DecodeError
        nil
      end
    end
end
