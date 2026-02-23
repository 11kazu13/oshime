# アーティストのドメインモデル
class Artist < ApplicationRecord
  # 1人のアーティストが複数のコメントを持ち親（アーティスト）が削除された際には子（コメント）も破壊される
  has_many :artist_comments, dependent: :destroy

  # バリデーションの実装
  validates :name, presence: true
end
