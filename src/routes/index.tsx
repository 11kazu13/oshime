import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getArtists } from '#/server/artists'

const TAGS = [
  '男性アイドル',
  '女性アイドル',
  'ボーイズグループ',
  'ガールズグループ',
  'K-POP',
  '地下アイドル',
  'etc',
]

const SHELF_IMAGES = [
  '/images/lagoon-1.svg',
  '/images/lagoon-2.svg',
  '/images/lagoon-3.svg',
  '/images/lagoon-4.svg',
  '/images/lagoon-5.svg',
  '/images/lagoon-about.svg',
]

type ShelfArtist = {
  id?: number
  name: string
  groupName?: string | null
  memberColor?: string | null
  imageUrl: string
}

const FALLBACK_ARTISTS: ShelfArtist[] = [
  { name: 'NOVA', groupName: 'ASTRA', imageUrl: SHELF_IMAGES[0], memberColor: '#6367FF' },
  { name: 'HARU', groupName: 'LUMIERE', imageUrl: SHELF_IMAGES[1], memberColor: '#8494FF' },
  { name: 'RINA', groupName: 'MELODY8', imageUrl: SHELF_IMAGES[2], memberColor: '#C9BEFF' },
  { name: 'SORA', groupName: 'ASTRA', imageUrl: SHELF_IMAGES[3], memberColor: '#6367FF' },
  { name: 'YUINA', groupName: 'SPARKLE', imageUrl: SHELF_IMAGES[4], memberColor: '#FFDBFD' },
  { name: 'KANON', groupName: 'LUMIERE', imageUrl: SHELF_IMAGES[5], memberColor: '#8494FF' },
]

export const Route = createFileRoute('/')({
  loader: async ({ deps }) => await getArtists({ data: { q: (deps as { q?: string }).q } }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    return {
      q: (search.q as string) || undefined,
    }
  },
  component: TopPage,
})

function TopPage() {
  const initialData = Route.useLoaderData()
  const { q } = Route.useSearch()

  const { data } = useQuery({
    queryKey: ['artists', q],
    queryFn: () => getArtists({ data: { q } }),
    initialData,
  })

  const artists = buildShelfArtists(data ?? [])
  const spotlight = pickWithWrap(artists, 0, 6)
  const favorites = pickWithWrap(artists, 2, 6)
  const ranking = pickWithWrap(artists, 0, 5)
  const groupCount = new Set(
    artists
      .map((artist) => artist.groupName?.trim())
      .filter((group): group is string => Boolean(group)),
  ).size

  return (
    <main className="idol-home px-4 pb-14 pt-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px] space-y-8">

        <section className="space-y-3">
          <h2 className="m-0 text-xl font-bold text-white">タグ</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TAGS.map((tag) => (
              <button key={tag} type="button" className="idol-tag whitespace-nowrap">
                {tag}
              </button>
            ))}
          </div>
        </section>

        <ArtistSection title="人気・注目" artists={spotlight} />
        <ArtistSection title="お気に入り" artists={favorites} />
        <ArtistSection title="ランキング" artists={ranking} ranked />
      </div>
    </main>
  )
}

function ArtistSection({
  title,
  artists,
  ranked = false,
}: {
  title: string
  artists: ShelfArtist[]
  ranked?: boolean
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="m-0 text-xl font-bold text-white sm:text-2xl">{title}</h2>
        <p className="m-0 text-xs font-semibold tracking-[0.16em] text-[#FFDBFD]">
          {artists.length} ITEMS
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist, index) => (
          <ArtistCard
            key={`${title}-${artist.id ?? artist.name}-${index}`}
            artist={artist}
            rank={ranked ? index + 1 : undefined}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

function ArtistCard({
  artist,
  rank,
  index,
}: {
  artist: ShelfArtist
  rank?: number
  index: number
}) {
  const accentColor = artist.memberColor?.trim() || '#8494FF'
  const card = (
    <article
      className="idol-card overflow-hidden rounded-2xl border border-[#FFDBFD] bg-[#C9BEFF]"
      style={{ animationDelay: `${Math.min(index, 7) * 70}ms` }}
    >
      <div className="relative">
        <img
          src={artist.imageUrl}
          alt={`${artist.name}の画像`}
          className="h-44 w-full object-cover sm:h-52"
          loading="lazy"
        />
        {typeof rank === 'number' ? (
          <span className="absolute left-3 top-3 rounded-full border border-[#FFDBFD] bg-[#6367FF] px-3 py-1 text-xs font-bold text-white">
            #{rank}
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <p className="m-0 text-xs font-bold tracking-[0.14em] text-white/85">
          {artist.groupName || 'SOLO'}
        </p>
        <h3 className="m-0 text-lg font-bold text-white">{artist.name}</h3>
        <span
          className="block h-1.5 w-16 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </article>
  )

  if (typeof artist.id === 'number') {
    return (
      <Link
        to="/artists/$id"
        params={{ id: artist.id.toString() }}
        className="rounded-2xl no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDBFD]"
      >
        {card}
      </Link>
    )
  }

  return card
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="idol-stat-card rounded-2xl border border-[#FFDBFD] p-4">
      <p className="m-0 text-xs font-bold tracking-[0.14em] text-white/85">{label}</p>
      <p className="m-0 mt-2 text-2xl font-extrabold text-white">{value}</p>
    </article>
  )
}

function buildShelfArtists<
  T extends {
    id: number
    name: string | null
    groupName: string | null
    memberColor: string | null
  },
>(artists: T[]): ShelfArtist[] {
  const mapped: ShelfArtist[] = []

  artists.forEach((artist, index) => {
    const name = artist.name?.trim()
    if (!name) return

    mapped.push({
      id: artist.id,
      name,
      groupName: artist.groupName,
      memberColor: artist.memberColor,
      imageUrl: SHELF_IMAGES[index % SHELF_IMAGES.length],
    })
  })

  return mapped.length > 0 ? mapped : FALLBACK_ARTISTS
}

function pickWithWrap<T>(items: T[], start: number, count: number): T[] {
  if (items.length === 0) return []

  const picked: T[] = []
  for (let index = 0; index < count; index += 1) {
    picked.push(items[(start + index) % items.length])
  }
  return picked
}
