import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ArtistDetail from './ArtistDetail';

interface Artist {
  id: number;
  name: string;
}

function ArtistList() {
  // メモ用紙たち（useState）
  const [artists, setArtists] = useState<Artist[]>([]);
  const [name, setName] = useState('');
  const [group_name, setGroup_name] = useState('');
  const [member_color, setMember_color] = useState('');

  useEffect(() => {
    // rails apiからデータを取得する
    fetch('http://localhost:3000/artists')
      .then((res) => res.json())
      .then((data) => setArtists(data));
  }, []);

  // 送信ボタンが押された時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 送信するデータをオブジェクトで作る
    const artistData = {
      artist: {
        name: name,
        group_name: group_name,
        member_color: member_color,
      },
    };

    // fetchでrailsに送る
    fetch('http://localhost:3000/artists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artistData),
    }).then((res) => {
      if (res.ok) {
        // 成功した場合
        // 入力欄のリセット
        setName('');
        setGroup_name('');
        setMember_color('');
        console.log('登録成功');
        // 中身を解析
        return (
          res
            .json()
            // リスト更新
            .then((data) => {
              setArtists([...artists, data]);
            })
        );
      } else {
        // 失敗した場合
        console.log('登録失敗');
      }
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>推しメン一覧</h1>

      <form onSubmit={handleSubmit}>
        {/* アーティスト名の入力欄 */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力してください"
          type="text"
        />
        {/* グループ名の入力欄 */}
        <input
          value={group_name}
          onChange={(e) => setGroup_name(e.target.value)}
          placeholder="グループ名を入力してください"
          type="text"
        />
        {/* メンバーカラーの入力欄 */}
        <input
          value={member_color}
          onChange={(e) => setMember_color(e.target.value)}
          placeholder="メンバーカラーを入力してください"
          type="text"
        />
        <button type="submit">登録</button>
      </form>

      {artists.length === 0 ? (
        <p>データがまだありません。railsコンソールで登録してみてね！</p>
      ) : (
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>
              <Link to={`/artists/${artist.id}`}>{artist.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
