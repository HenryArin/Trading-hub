class Post < ApplicationRecord
  has_many :comments, dependent: :destroy  # ✅ Automatically deletes comments when post is deleted
  belongs_to :user
end
