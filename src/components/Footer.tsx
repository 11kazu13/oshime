export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-[#FFDBFD] bg-transparent px-4 py-8">
      <div className="page-wrap flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm text-white">
          &copy; {year} OSHIME. All rights reserved.
        </p>
        <p className="m-0 text-xs font-semibold tracking-[0.22em] text-[#FFDBFD]">
          IDOL DISCOVERY TOP
        </p>
      </div>
    </footer>
  )
}
