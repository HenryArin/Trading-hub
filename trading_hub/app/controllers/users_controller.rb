class UsersController < ApplicationController
    before_action :authorize_admin, only: [ :index, :destroy, :ban, :unban, :promote, :demote ]

    def ban
      user = User.find_by(id: params[:id])

      if user.nil?
        render json: { error: "User not found" }, status: :not_found
        return
      end

      if user.admin
        render json: { error: "Cannot ban another admin" }, status: :forbidden
        return
      end

      user.update(banned: true)
      log_admin_action("banned", user.id)

      render json: { message: "User has been banned" }, status: :ok
    end

    def unban
      user = User.find_by(id: params[:id])

      if user.nil?
        render json: { error: "User not found" }, status: :not_found
        return
      end

      user.update(banned: false)
      log_admin_action("unbanned", user.id)

      render json: { message: "User has been unbanned" }, status: :ok
    end

    def destroy
      user = User.find_by(id: params[:id])

      if user.nil?
        render json: { error: "User not found" }, status: :not_found
        return
      end

      if user.id == @current_user.id
        render json: { error: "You cannot delete yourself" }, status: :forbidden
        return
      end

      if user.admin
        render json: { error: "Cannot delete another admin" }, status: :forbidden
        return
      end

      user.destroy
      log_admin_action("deleted", user.id)

      render json: { message: "User deleted successfully" }, status: :ok
    end

    def promote
      user = User.find_by(id: params[:id])

      if user.nil?
        render json: { error: "User not found" }, status: :not_found
        return
      end

      if user.admin
        render json: { error: "User is already an admin" }, status: :bad_request
        return
      end

      user.update(admin: true)
      log_admin_action("promoted", user.id)

      render json: { message: "User promoted to admin" }, status: :ok
    end

    def demote
      user = User.find_by(id: params[:id])

      if user.nil?
        render json: { error: "User not found" }, status: :not_found
        return
      end

      if !user.admin
        render json: { error: "User is not an admin" }, status: :bad_request
        return
      end

      if user.id == @current_user.id
        render json: { error: "You cannot demote yourself" }, status: :forbidden
        return
      end

      user.update(admin: false)
      log_admin_action("demoted", user.id)

      render json: { message: "User demoted to regular user" }, status: :ok
    end

    private

    def log_admin_action(action, user_id)
      AdminActionLog.create(admin_id: @current_user.id, user_id: user_id, action: action)
    end

    def authorize_admin
      token = request.headers["Authorization"]

      if token.blank?
        return render json: { error: "Unauthorized - No token provided" }, status: :unauthorized
      end

      token = token.split(" ").last if token&.start_with?("Bearer")
      decoded_token = decode_token(token)

      if decoded_token.nil? || !decoded_token["admin"]
        render json: { error: "Unauthorized - Admin access required" }, status: :unauthorized
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
