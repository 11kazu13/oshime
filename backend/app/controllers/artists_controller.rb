class ArtistsController < ApplicationController
  before_action :set_artist, only: %i[ show update destroy ]

  # GET /artists
  def index
    q = params[:q].to_s.strip
    artists = Artist.all

    if q.present?
      like = "%#{ActiveRecord::Base.sanitize_sql_like(q)}%"
    artists = artists.where("name LIKE :q OR group_name LIKE :q", q: like)
  end

  render json: artists
  end

  # GET /artists/1
  def show
    render json: @artist
  end

  # POST /artists
  def create
    @artist = Artist.new(artist_params)

    if @artist.save
      render json: @artist, status: :created, location: @artist
    else
      render json: @artist.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /artists/1
  def update
    if @artist.update(artist_params)
      render json: @artist
    else
      render json: @artist.errors, status: :unprocessable_content
    end
  end

  # DELETE /artists/1
  def destroy
    @artist.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_artist
      @artist = Artist.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def artist_params
      params.require(:artist).permit(
        :name,
        :group_name,
        :member_color,
        :birthday,
        :birthplace,
        :mbti,
        :x_account
      )
    end
end
