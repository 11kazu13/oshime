import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

const CATEGORY_TAGS = [
  'ジャニーズ',
  '男性KPOP',
  '女性KPOP',
  'メンズ地下アイドル',
  '女性地下アイドル',
  '舞台俳優',
  'Vtuber',
  '2.5次元俳優',
  'インフルエンサー',
  'バンド',
  '海外アーティスト',
  'LDH',
]

function RegisterPage() {
  return (
    <main className="px-4 pb-16 pt-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[960px] space-y-4">
        <p className="m-0 text-xs font-bold tracking-[0.18em] text-[#FFDBFD]">
          REGISTER (TEMP)
        </p>
        <h1 className="display-title m-0 text-2xl sm:text-3xl">
          登録ページ（仮）
        </h1>
        <p className="m-0 text-sm text-white/85 sm:text-base">
          ここは仮の登録ページです。必須項目は「名前」「グループ名」です。
        </p>
      </div>
      <form className="mx-auto mt-8 w-full max-w-[960px] space-y-6 rounded-[20px] border border-[#FFDBFD] bg-[color-mix(in_oklab,#C9BEFF,transparent_30%)] p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-white">
              名前 <span className="text-[#FFDBFD]">*</span>
            </span>
            <input
              required
              name="name"
              placeholder="例: SORA"
              className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-white">
              グループ名 <span className="text-[#FFDBFD]">*</span>
            </span>
            <input
              required
              name="groupName"
              placeholder="例: ASTRA"
              className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-white">誕生日</span>
            <input
              type="date"
              name="birthday"
              className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-white">出生地</span>
            <input
              name="birthplace"
              placeholder="例: 東京都"
              className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-white">MBTI</span>
            <input
              name="mbti"
              placeholder="例: INFJ"
              className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-white">メンバーカラー</span>
            <input
              name="memberColor"
              placeholder="例: #6367FF"
              className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-white">Xアカウント</span>
            <input
              name="xAccount"
              placeholder="例: @oshime"
              className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
            />
          </label>
        </div>

        <div className="space-y-3">
          <p className="m-0 text-sm font-semibold text-white">タグ</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_TAGS.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-2 rounded-xl border border-[#FFDBFD] bg-[rgba(201,190,255,0.7)] px-3 py-2 text-sm text-white"
              >
                <input type="checkbox" name="tags" value={tag} className="h-4 w-4" />
                <span>{tag}</span>
              </label>
            ))}
          </div>
          <div className="space-y-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-white">タグ追加リクエスト</span>
              <input
                name="tagRequest"
                placeholder="例: シンガーソングライター"
                className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
              />
            </label>
            <p className="m-0 text-xs text-white/75">
              ないものは運営にリクエストできます。
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#FFDBFD] bg-[#6367FF] px-6 text-sm font-bold text-white transition hover:bg-[#FFDBFD]"
          >
            登録（仮）
          </button>
        </div>
      </form>
    </main>
  )
}
