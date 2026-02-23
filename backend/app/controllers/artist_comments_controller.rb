class ArtistCommentsController < ApplicationController
  before_action :set_artist

  # GET /artists/:artist_id/comments
  def index
    comments = @artist.artist_comments.order(created_at: :desc)
    render json: comments
  end

  # POST /artists/:artist_id/comments
  def create
    comment = @artist.artist_comments.new(artist_comment_params)

    if comment.save
      render json: comment, status: :created
    else
      render json: comment.errors, status: :unprocessable_content
    end
  end

  private
    def set_artist
      @artist = Artist.find(params.expect(:artist_id))
    end

    def artist_comment_params
      params.require(:artist_comment).permit(:body, :rating)
    end
end
