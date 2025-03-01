class SessionsController < ApplicationController
    skip_forgery_protection

    def create
      user = User.find_by(email: params[:email])

      if user.nil? || !user.authenticate(params[:password])
        render json: { error: "Invalid email or password" }, status: :unauthorized
        return
      end

      if user.banned
        render json: { error: "Your account has been banned. Contact support for more details." }, status: :forbidden
        return
      end

      exp = 24.hours.from_now.to_i
      token = encode_token({ user_id: user.id, admin: user.admin, iat: Time.now.to_i, exp: exp })

      render json: { token: token, admin: user.admin }, status: :ok
    end

    def logout
      token = request.headers["Authorization"]

      if token.blank?
        return render json: { error: "No token provided" }, status: :unprocessable_entity
      end

      # Extract token signature (the last part of JWT)
      signature = token.split(".").last

      # Check if the token signature is already blacklisted
      if BlacklistedToken.exists?(token: signature)
        return render json: { error: "Token already invalidated" }, status: :unauthorized
      end

      # Blacklist the token signature
      BlacklistedToken.create(token: signature)
      render json: { message: "Logged out successfully" }, status: :ok
    end

    private

    def encode_token(payload)
      JWT.encode(payload, ENV["JWT_SECRET_KEY"], "HS256")
    end
end
