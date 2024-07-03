# Travel-Point의 웹 프론트

```bash
# 먼저 node.js가 설치 되어 있어야 됩니다.
# 로컬에서 실행 순서
# 1. `.env.local` 파일 설정
# 2. 아래 명령어 실행
npm install
npm run dev
```

## 배포

배포 주소 : [travel-point 사이트](https://travel-point-umber.vercel.app/ "travel-point")

- `Next.js`
- `TypeScript`
- `Tailwindcss`
- `React-query`
- `Zustand`

## 폴더 구조

```text
root
├── public
├── prisma
└── src
    ├── app # 앱라우트
    │   ├── @modal
    │   ├── api
    │   ├── auth
    │   ├── destinations
    │   │   └── [slug]
    │   ├── festivals
    │   │   └── [slug]
    │   ├── mypage
    │   ├── recommended
    │   ├── regions
    │   └── themes
    ├── assets
    ├── components
    ├── config
    ├── context
    ├── data
    ├── hooks
    ├── libs
    ├── services
    ├── store
    ├── styles
    └── types
```

## 환경 변수 설정

```text:.env
# .env | .env.local
# BASE_URL
NEXT_PUBLIC_API_BASE_URL=

# naver blog search api
NEXT_PUBLIC_NAVER_SEARCH_ID=
NEXT_PUBLIC_NAVER_SEARCH_KEY=

# kakao api
NEXT_PUBLIC_KAKAO_ID=
NEXT_PUBLIC_KAKAO_MAP_KEY=

# mysql - 관광데이터 id,ps
NEXT_PUBLIC_API_USERNAME=
NEXT_PUBLIC_API_PASSWORD=

# oauth github, google url
NEXT_PUBLIC_OAUTH_NAVER_URL=
NEXT_PUBLIC_OAUTH_GOOGLE_URL=

NEXT_PUBLIC_LOGIN_URL=
NEXT_PUBLIC_JOIN_URL=

NEXT_PUBLIC_CF_ID=
NEXT_PUBLIC_CF_TOKEN=
```
