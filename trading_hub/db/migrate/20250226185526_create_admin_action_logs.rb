class AdminLogsController < ApplicationController
  before_action :authorize_admin

  def index
    logs = AdminActionLog.includes(:admin, :user).order(created_at: :desc)
    formatted_logs = logs.map do |log|
      {
        id: log.id,
        admin: log.admin.username,
        user: log.user.username,
        action: log.action,
        timestamp: log.created_at.strftime("%Y-%m-%d %H:%M:%S")
      }
    end
    render json: formatted_logs
  end

  private

  def authorize_admin
    token = request.headers["Authorization"]
    token = token.split(" ").last if token&.start_with?("Bearer")
    decoded_token = decode_token(token)

    if decoded_token.nil? || !decoded_token["admin"]
      render json: { error: "Unauthorized - Admin access required" }, status: :unauthorized
    end
  end
end
