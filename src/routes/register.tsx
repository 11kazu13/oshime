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

const MEMBER_COLORS = [
  '赤',
  '青',
  '緑',
  '黄',
  '紫',
  'ピンク',
  'オレンジ',
  '白',
  '黒',
  'その他',
]

const BIRTHPLACES = [
  '北海道',
  '青森',
  '岩手',
  '宮城',
  '秋田',
  '山形',
  '福島',
  '茨城',
  '栃木',
  '群馬',
  '埼玉',
  '千葉',
  '東京',
  '神奈川',
  '新潟',
  '富山',
  '石川',
  '福井',
  '山梨',
  '長野',
  '岐阜',
  '静岡',
  '愛知',
  '三重',
  '滋賀',
  '京都',
  '大阪',
  '兵庫',
  '奈良',
  '和歌山',
  '鳥取',
  '島根',
  '岡山',
  '広島',
  '山口',
  '徳島',
  '香川',
  '愛媛',
  '高知',
  '福岡',
  '佐賀',
  '長崎',
  '熊本',
  '大分',
  '宮崎',
  '鹿児島',
  '沖縄',
  '海外',
  '不明',
]

const MBTI_TYPES = [
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'ESFP',
  '不明',
]

function RegisterPage() {
  return (
    <main className="px-4 pb-16 pt-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[960px] space-y-4">
        <p className="m-0 text-xs font-bold tracking-[0.18em] text-[#FFDBFD]">
          REGISTER 
        </p>
        <h1 className="display-title m-0 text-2xl sm:text-3xl">
          登録ページ
        </h1>
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
            <select
              name="birthplace"
              defaultValue=""
              className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
            >
              <option value="" disabled className="text-gray-400">
                選択してください
              </option>
              {BIRTHPLACES.map((place) => (
                <option key={place} value={place} className="text-black">
                  {place}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-white">MBTI</span>
            <select
              name="mbti"
              defaultValue=""
              className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
            >
              <option value="" disabled className="text-gray-400">
                選択してください
              </option>
              {MBTI_TYPES.map((type) => (
                <option key={type} value={type} className="text-black">
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-white">メンバーカラー</span>
            <select
              name="memberColor"
              defaultValue=""
              className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
            >
              <option value="" disabled className="text-gray-400">
                選択してください
              </option>
              {MEMBER_COLORS.map((color) => (
                <option key={color} value={color} className="text-black">
                  {color}
                </option>
              ))}
            </select>
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
                <input type="radio" name="tag" value={tag} className="h-4 w-4" />
                <span>{tag}</span>
              </label>
            ))}
          </div>
          <div className="space-y-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-white">その他タグ</span>
              <input
                name="tagRequest"
                placeholder="例: シンガーソングライター"
                className="h-11 rounded-xl border border-[#FFDBFD] bg-[#C9BEFF] px-4 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-[#FFDBFD] focus:ring-2 focus:ring-[#FFDBFD]/40"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#FFDBFD] bg-[#6367FF] px-6 text-sm font-bold text-white transition hover:bg-[#FFDBFD]"
          >
            登録
          </button>
        </div>
      </form>
    </main>
  )
}
