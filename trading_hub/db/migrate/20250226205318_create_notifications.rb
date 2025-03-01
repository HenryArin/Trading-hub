class CreateNotifications < ActiveRecord::Migration[7.0]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true
      t.string :message, null: false
      t.boolean :read, default: false  # ✅ Added default value

      t.timestamps
    end
  end
end
