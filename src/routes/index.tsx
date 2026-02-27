import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { getArtists, createArtist } from '#/server/artists'
import { useQuery, useMutation } from '@tanstack/react-query'

export const Route = createFileRoute('/')({
  loader: async ({ deps }) => await getArtists({ data: { q: (deps as { q?: string }).q } }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    return {
      q: (search.q as string) || undefined,
    }
  },
  component: ArtistList,
})

function ArtistList() {
  const router = useRouter()
  // Loader data provides the initial data for SSR, useQuery handles client side updates
  const initialData = Route.useLoaderData()
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { data: artists } = useQuery({
    queryKey: ['artists', q],
    queryFn: () => getArtists({ data: { q } }),
    initialData,
  })

  const [name, setName] = useState('')
  const [groupName, setGroupName] = useState('')
  const [memberColor, setMemberColor] = useState('')
  const [searchInput, setSearchInput] = useState(q || '')

  const createMutation = useMutation({
    mutationFn: async (payload: {
      name: string
      groupName?: string
      memberColor?: string
    }) => {
      return await createArtist({ data: payload })
    },
    onSuccess: () => {
      setName('')
      setGroupName('')
      setMemberColor('')
      router.invalidate() // Triggers a reload of loader data
    },
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ search: { q: searchInput || undefined } })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createMutation.mutate({
      name,
      groupName: groupName || undefined,
      memberColor: memberColor || undefined,
    })
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">推しメン一覧</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8 flex flex-col gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="名前 / グループ名で検索"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            検索
          </button>
        </form>

        <hr className="my-2 border-slate-100" />
        <h2 className="text-lg font-semibold text-slate-700">新規登録</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前 (必須)"
            required
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="グループ名"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={memberColor}
            onChange={(e) => setMemberColor(e.target.value)}
            placeholder="カラー"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={createMutation.isPending}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            登録
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {artists.length === 0 ? (
          <p className="text-slate-500 text-center py-8">該当するデータがありません</p>
        ) : (
          <ul className="divide-y">
            {artists.map((artist) => (
              <li key={artist.id} className="py-4 flex items-center justify-between hover:bg-slate-50 px-4 -mx-4 rounded-md transition">
                <div>
                  <Link
                    to="/artists/$id"
                    params={{ id: artist.id.toString() }}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {artist.name}
                  </Link>
                  {artist.groupName && (
                    <span className="ml-2 text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {artist.groupName}
                    </span>
                  )}
                </div>
                {artist.memberColor && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Color</span>
                    <div 
                      className="w-4 h-4 rounded-full border border-slate-200" 
                      style={{ backgroundColor: artist.memberColor }}
                      title={artist.memberColor}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
