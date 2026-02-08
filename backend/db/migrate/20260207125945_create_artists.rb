class CreateArtists < ActiveRecord::Migration[8.1]
  def change
    create_table :artists do |t|
      t.string :name
      t.date :birthday
      t.string :mbti
      t.string :birthplace
      t.string :member_color
      t.string :group_name
      t.string :x_account

      t.timestamps
    end
  end
end
