# アーティストのコメント・評価に関するDBのテーブルを作成

class CreateArtistComments < ActiveRecord::Migration[8.1]
  def change
    create_table :artist_comments do |t|
      t.references :artist, null: false, foreign_key: true # artist_idというコメント・評価がどのアーティストに紐づくかというキーを作成
      t.text :body, null: false
      t.integer :rating, null: false

      t.timestamps
    end
  end
end
