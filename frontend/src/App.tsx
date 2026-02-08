import { useEffect, useState } from "react";

interface Artist {
  id: number;
  name: string;
}

function App() {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    // rails apiからデータを取得する
    fetch("http://localhost:3000/artists")
    .then(res => res.json())
    .then(data => setArtists(data))
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>推しメン一覧</h1>
      {artists.length === 0 ? (
        <p>データがまだありません。railsコンソールで登録してみてね！</p>
      ) : (
        <ul>
          {artists.map(artist => (
            <li key={artist.id}>{artist.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App;
