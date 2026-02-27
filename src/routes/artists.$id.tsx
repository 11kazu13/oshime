import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { getArtistById, getArtistComments, createArtistComment } from '#/server/artists'
import { useQuery, useMutation } from '@tanstack/react-query'

export const Route = createFileRoute('/artists/$id')({
  loader: async ({ params: { id } }) => {
    const artistId = Number(id)
    const [artist, comments] = await Promise.all([
      getArtistById({ data: { id: artistId } }),
      getArtistComments({ data: { artistId } }),
    ])
    return { artist, comments }
  },
  component: ArtistDetail,
})

function ArtistDetail() {
  const router = useRouter()
  const { id } = Route.useParams()
  const artistId = Number(id)
  
  // Use loader data for initial SSR
  const initialData = Route.useLoaderData()

  const { data: artist } = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => getArtistById({ data: { id: artistId } }),
    initialData: initialData.artist,
  })

  const { data: comments } = useQuery({
    queryKey: ['artistComments', artistId],
    queryFn: () => getArtistComments({ data: { artistId } }),
    initialData: initialData.comments,
  })

  const [commentBody, setCommentBody] = useState('')
  const [rating, setRating] = useState(5)

  const createCommentMutation = useMutation({
    mutationFn: async (payload: { body: string; rating: number }) => {
      return await createArtistComment({
        data: {
          artistId,
          body: payload.body,
          rating: payload.rating,
        },
      })
    },
    onSuccess: () => {
      setCommentBody('')
      setRating(5)
      router.invalidate() // Reload loader data to sync
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentBody.trim()) return
    createCommentMutation.mutate({ body: commentBody.trim(), rating })
  }

  const renderStars = (value: number) => {
    const filled = '★'.repeat(value)
    const empty = '☆'.repeat(7 - value) // Max rating seems to be 7 based on original code
    return `${filled}${empty}`
  }

  if (!artist) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1">
          &larr; 一覧に戻る
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="flex items-center gap-4 border-b pb-4 mb-6">
          <h1 className="text-4xl font-bold text-slate-800">{artist.name}</h1>
          {artist.memberColor && (
             <div 
               className="w-8 h-8 rounded-full border border-slate-200 shadow-inner" 
               style={{ backgroundColor: artist.memberColor }}
               title={`Member Color: ${artist.memberColor}`}
             />
          )}
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="col-span-1">
            <dt className="text-sm font-medium text-slate-500 mb-1">グループ名</dt>
            <dd className="text-lg text-slate-800 bg-slate-50 p-3 rounded-md border">{artist.groupName || '未登録'}</dd>
          </div>
          <div className="col-span-1">
            <dt className="text-sm font-medium text-slate-500 mb-1">誕生日</dt>
            <dd className="text-lg text-slate-800 bg-slate-50 p-3 rounded-md border">{artist.birthday || '未登録'}</dd>
          </div>
          <div className="col-span-1">
            <dt className="text-sm font-medium text-slate-500 mb-1">出身地</dt>
            <dd className="text-lg text-slate-800 bg-slate-50 p-3 rounded-md border">{artist.birthplace || '未登録'}</dd>
          </div>
          <div className="col-span-1">
            <dt className="text-sm font-medium text-slate-500 mb-1">MBTI</dt>
            <dd className="text-lg text-slate-800 bg-slate-50 p-3 rounded-md border">{artist.mbti || '未登録'}</dd>
          </div>
          <div className="col-span-1 md:col-span-2">
            <dt className="text-sm font-medium text-slate-500 mb-1">Xアカウント</dt>
            <dd className="text-lg text-blue-600 bg-slate-50 p-3 rounded-md border">
              {artist.xAccount ? (
                <a href={`https://x.com/${artist.xAccount}`} target="_blank" rel="noreferrer" className="hover:underline">
                   @{artist.xAccount}
                </a>
              ) : '未登録'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b">コメントと評価</h2>
        
        <form onSubmit={handleSubmit} className="mb-10 bg-slate-50 p-6 rounded-lg border">
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 block mb-2">評価（1〜7）</label>
            <div className="flex items-center gap-4">
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <span className="text-yellow-400 text-xl tracking-widest">{renderStars(rating)}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 block mb-2">コメント</label>
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="推しの尊さを語ってください"
              rows={4}
              required
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={createCommentMutation.isPending}
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {createCommentMutation.isPending ? '投稿中...' : '投稿する'}
          </button>
        </form>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700 mb-4 tracking-wide">新着コメント</h3>
          {!comments || comments.length === 0 ? (
            <p className="text-slate-500 text-center py-8 bg-slate-50 rounded-lg border border-dashed">
              まだコメントがありません。最初のコメントを投稿しましょう！
            </p>
          ) : (
            <ul className="divide-y">
              {comments.map((comment) => (
                <li key={comment.id} className="py-5 first:pt-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-yellow-400 tracking-widest text-lg">{renderStars(comment.rating)}</div>
                    <span className="text-sm text-slate-400">
                      {new Date(comment.createdAt).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{comment.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
