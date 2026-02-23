import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface ArtistDetailData {
  id: number;
  name: string;
  group_name: string;
  member_color: string;
  birthday: string;
  birthplace: string;
  mbti: string;
  x_account: string;
}

interface ArtistComment {
  id: number;
  body: string;
  rating: number;
  created_at: string;
}

function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<ArtistDetailData | null>(null);
  const [comments, setComments] = useState<ArtistComment[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/artists/${id}`)
      .then((res) => res.json())
      .then((data) => setArtist(data));

    fetch(`http://localhost:3000/artists/${id}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [id]);

  const renderStars = (value: number) => {
    const filled = '★'.repeat(value);
    const empty = '☆'.repeat(7 - value);
    return `${filled}${empty}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) {
      return;
    }

    setIsSubmitting(true);
    const payload = {
      artist_comment: {
        body: commentBody.trim(),
        rating: rating,
      },
    };

    fetch(`http://localhost:3000/artists/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to create comment');
        }
        return res.json();
      })
      .then((data) => {
        setComments([data, ...comments]);
        setCommentBody('');
        setRating(5);
      })
      .finally(() => setIsSubmitting(false));
  };

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{artist.name}</h1>
      <dl>
        <dt><strong>グループ名</strong></dt>
        <dd>{artist.group_name || '未登録'}</dd>

        <dt><strong>メンバーカラー</strong></dt>
        <dd>{artist.member_color || '未登録'}</dd>

        <dt><strong>誕生日</strong></dt>
        <dd>{artist.birthday || '未登録'}</dd>

        <dt><strong>出身地</strong></dt>
        <dd>{artist.birthplace || '未登録'}</dd>

        <dt><strong>MBTI</strong></dt>
        <dd>{artist.mbti || '未登録'}</dd>

        <dt><strong>Xアカウント</strong></dt>
        <dd>{artist.x_account || '未登録'}</dd>
      </dl>

      <section style={{ marginTop: '32px' }}>
        <h2>コメントと評価</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '8px' }}>
            <label>
              評価（1〜7）
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ marginLeft: '8px' }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <span style={{ marginLeft: '8px' }}>{renderStars(rating)}</span>
          </div>
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="コメントを入力してください"
            rows={4}
            style={{ width: '100%', maxWidth: '480px' }}
          />
          <div style={{ marginTop: '8px' }}>
            <button type="submit" disabled={isSubmitting}>
              投稿
            </button>
          </div>
        </form>

        {comments.length === 0 ? (
          <p>まだコメントがありません。</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} style={{ marginBottom: '8px' }}>
                <div>{renderStars(comment.rating)}</div>
                <div>{comment.body}</div>
                <small>
                  {new Date(comment.created_at).toLocaleString('ja-JP')}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div style={{ marginTop: '20px' }}>
        <Link to="/">一覧に戻る</Link>
      </div>
    </div>
  );
}

export default ArtistDetail;
