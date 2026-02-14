import { useEffect, useState } from 'react';
// 1. ルーティングに必要な部品をインポート
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ArtistDetail from './ArtistDetail';

interface Artist {
  id: number;
  name: string;
  group_name?: string;
}

// 2. 名前を「ArtistList」に変更
function ArtistList() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [name, setName] = useState('');
  const [group_name, setGroup_name] = useState('');
  const [member_color, setMember_color] = useState('');
  const [search, setSearch] = useState('');

  const fetchArtists = (q = '') => {
    const url = q
      ? `http://localhost:3000/artists?q=${encodeURIComponent(q)}`
      : 'http://localhost:3000/artists'; // タイポも修正

    fetch(url)
      .then((res) => res.json())
      .then((data) => setArtists(data));
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const artistData = { artist: { name, group_name, member_color } };
    fetch('http://localhost:3000/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artistData),
    }).then((res) => {
      if (res.ok) {
        setName('');
        setGroup_name('');
        setMember_color('');
        fetchArtists(search);
      }
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArtists(search.trim());
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>推しメン一覧</h1>
      {/* 検索・登録フォームはそのまま保持 */}
      <form onSubmit={handleSearch} style={{ marginBottom: '12px' }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="名前 / グループ名で検索" />
        <button type="submit">検索</button>
      </form>

      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" />
        <input value={group_name} onChange={(e) => setGroup_name(e.target.value)} placeholder="グループ名" />
        <input value={member_color} onChange={(e) => setMember_color(e.target.value)} placeholder="カラー" />
        <button type="submit">登録</button>
      </form>

      {artists.length === 0 ? (
        <p>該当するデータがありません</p>
      ) : (
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>
              {/* 3. 両方の変更を合体：リンクにしつつ、グループ名も表示 */}
              <Link to={`/artists/${artist.id}`}>{artist.name}</Link>
              {artist.group_name ? `（${artist.group_name}）` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 全体を管理するAppコンポーネント
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArtistList />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;