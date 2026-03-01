import { Link } from '@tanstack/react-router'

export default function Header() {
  const iconButtonClass =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FFDBFD] bg-[#C9BEFF] text-white transition hover:bg-[#FFDBFD]'

  return (
    <header className="sticky top-0 z-50 border-b border-[#FFDBFD] bg-[#6367FF] px-4">
      <nav className="page-wrap flex items-center justify-between gap-3 py-3 sm:py-4">
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

        <div className="ml-auto flex items-center gap-2">
          <button type="button" className={iconButtonClass} aria-label="検索">
            <SearchIcon />
          </button>
          <button type="button" className={iconButtonClass} aria-label="マイページ">
            <UserIcon />
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FFDBFD] bg-[#C9BEFF] text-white transition hover:bg-[#FFDBFD]"
            aria-label="登録"
          >
            <PlusIcon />
          </button>
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
      </nav>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <path
        d="M15.5 15.5L20 20M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
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
