class ArtistComment < ApplicationRecord
  belongs_to :artist

  # バリデーションを実装
  validates :body, presence: true
  validates :rating, presence: true, inclusion: { in: 1..7 }
end
