class NotificationsController < ApplicationController
  before_action :authorize_user

  def index
    notifications = Notification.where(user_id: @current_user.id, read: false).order(created_at: :desc)
    render json: notifications
  end

  def mark_as_read
    notification = Notification.find_by(id: params[:id], user_id: @current_user.id)

    if notification.nil?
      render json: { error: "Notification not found" }, status: :not_found
    else
      notification.update(read: true)
      render json: { message: "Notification marked as read" }, status: :ok
    end
  end

  private

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

  # ✅ Added `decode_token` to prevent 500 errors
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
