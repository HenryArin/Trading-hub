Rails.application.routes.draw do
  # Authentication routes
  post "/login", to: "sessions#create"
  post "/logout", to: "sessions#logout"

  # User routes
  resources :users, only: [ :create, :index, :destroy ]

  # Post routes with nested comments
  resources :posts, only: [ :index, :create, :destroy ] do
    resources :comments, only: [ :index, :create, :destroy ]
  end
  resources :users, only: [ :index, :destroy ]
  # 🚀 Admin actions
  patch "/users/:id/promote", to: "users#promote"
  patch "/users/:id/demote", to: "users#demote"
  patch "/users/:id/ban", to: "users#ban"
  patch "/users/:id/unban", to: "users#unban"

  # Notifications routes
  get "/notifications", to: "notifications#index"
  patch "/notifications/:id/read", to: "notifications#mark_as_read"

  # Defines the root path route ("/")
  # root "posts#index"
end
