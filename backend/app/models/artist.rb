class Artist < ApplicationRecord
  validates :name, :group_name, :member_color, presence: true
end
