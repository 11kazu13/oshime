import { useEffect, useState } from 'react';

interface Artist {
  id: number;
  name: string;
  group_name?: string;
}

function App() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [name, setName] = useState('');
  const [group_name, setGroup_name] = useState('');
  const [member_color, setMember_color] = useState('');
  const [search, setSearch] = useState('');

  // 一覧取得（q があれば検索、なければ全件）
  const fetchArtists = (q = '') => {
    const url = q
      ? `http://localhost:3000/artists?q=${encodeURIComponent(q)}`
      : 'http://localhost:3000/artis

    fetch(url)
      .then((res) => res.json())
      .then((data) => setArtists(data));
  };

  // 初回表示時
  useEffect(() => {
    fetchArtists();
  }, []);

  // 登録
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const artistData = {
      artist: { name, group_name, member_color },
    };

    fetch('http://localhost:3000/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artistData),
    }).then((res) => {
      if (res.ok) {
        setName('');
        setGroup_name('');
        setMember_color('');
        // 登録後は現在の検索条件で再取得
        fetchArtists(search);
      } else {
        console.log('登録失敗');
      }
    });
  };

  // 検索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArtists(search.trim());
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>推しメン一覧</h1>

      {/* 検索フォーム */}
      <form onSubmit={handleSearch} style={{ marginBottom: '12px' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="名前 / グループ名で検索"
          type="text"
        />
        <button type="submit">検索</button>
      </form>

      {/* 登録フォーム */}
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力してください"
          type="text"
        />
        <input
          value={group_name}
          onChange={(e) => setGroup_name(e.target.value)}
          placeholder="グループ名を入力してください"
          type="text"
        />
        <input
          value={member_color}
          onChange={(e) => setMember_color(e.target.value)}
          placeholder="メンバーカラーを入力してください"
          type="text"
        />
        <button type="submit">登録</button>
      </form>

      {artists.length === 0 ? (
        <p>該当するデータがありません</p>
      ) : (
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>
              {artist.name}
              {artist.group_name ? `（${artist.group_name}）` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
