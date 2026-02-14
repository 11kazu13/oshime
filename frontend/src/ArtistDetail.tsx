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

function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<ArtistDetailData | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/artists/${id}`)
      .then((res) => res.json())
      .then((data) => setArtist(data));
  }, [id]);

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

      <div style={{ marginTop: '20px' }}>
        <Link to="/">一覧に戻る</Link>
      </div>
    </div>
  );
}

export default ArtistDetail;
