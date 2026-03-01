import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useId, useState, type FormEvent } from 'react'

export default function Header() {
  const iconButtonClass =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FFDBFD] bg-[#C9BEFF] text-white transition hover:bg-[#FFDBFD]'

  const navigate = useNavigate()

  const q = useRouterState({
    select: (state) =>
      typeof state.location.search?.q === 'string'
        ? state.location.search.q
        : undefined,
  })

  const searchInputId = useId()
  const [searchInput, setSearchInput] = useState(q || '')

  useEffect(() => {
    setSearchInput(q || '')
  }, [q])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate({ to: '/', search: { q: searchInput || undefined } })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#FFDBFD] bg-[#6367FF] px-4">
      <nav className="page-wrap flex flex-wrap items-center gap-3 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight text-white">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#FFDBFD] bg-transparent px-3 py-1.5 text-sm text-white no-underline sm:px-4 sm:py-2"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#C9BEFF] text-xs font-bold text-white">
              推
            </span>
            <span className="display-title text-base text-white sm:text-lg">
              OSHIME
            </span>
          </Link>
        </h2>

        <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row sm:items-center">
          <form
            onSubmit={handleSearch}
            className="flex w-full items-center gap-2 sm:w-[320px]"
          >
            <label htmlFor={searchInputId} className="sr-only">
              アーティスト検索
            </label>
            <input
              id={searchInputId}
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="アーティスト名 / グループ名で検索"
              className="h-10 min-w-0 flex-1 rounded-full border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm font-bold text-white transition hover:bg-[#FFDBFD]"
            >
              検索
            </button>
          </form>

          <div className="flex items-center gap-2">
            {/* ルートがあるなら Link に置き換えてOK（例: to="/me"） */}
            <button type="button" className={iconButtonClass} aria-label="マイページ">
              <UserIcon />
            </button>

            <Link to="/register" className={iconButtonClass} aria-label="登録">
              <PlusIcon />
            </Link>

            <Link
              to="/"
              className={iconButtonClass}
              activeProps={{
                className:
                  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FFDBFD] bg-[#FFDBFD] text-white',
              }}
              aria-label="トップページ"
            >
              <HomeIcon />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <path
        d="M18 20a6 6 0 0 0-12 0m9-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <path
        d="M12 5v14m7-7H5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <path
        d="M3 10.5 12 4l9 6.5M6.5 9.9V20h11V9.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}