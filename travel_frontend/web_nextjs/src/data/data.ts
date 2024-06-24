import { CategoryMapping } from "@/types/categoriy-types";
import localFont from "next/font/local";

export const heroImages = [
  {
    image: "/assets/image/보령녹차밭.webp",
    bgColor: "#8EB2D6",
    title: "보령 녹차밭",
  },
  {
    image: "/assets/image/부산용궁사.webp",
    bgColor: "#A2D2FF",
    title: "부산 용궁사",
  },
  {
    image: "/assets/image/안동하회마을.webp",
    bgColor: "#8EB2D6",
    title: "안동 하회마을",
  },
];

export const themeImages = [
  { title: "테마여행 역사 이미지", image: "/assets/image/테마역사.webp" },
  { title: "테마여행 힐링 이미지", image: "/assets/image/테마힐링.webp" },
];

export const REGIONS = [
  { name: "서울", path: "seoul" },
  { name: "경기", path: "gyeonggi" },
  { name: "인천", path: "incheon" },
  { name: "강원", path: "gangwon" },
  { name: "경북", path: "gyeongbuk" },
  { name: "경남", path: "gyeongnam" },
  { name: "대구", path: "daegu" },
  { name: "부산", path: "busan" },
  { name: "울산", path: "ulsan" },
  { name: "전남", path: "jeonnam" },
  { name: "전북", path: "jeonbuk" },
  { name: "제주", path: "jeju" },
  { name: "대전", path: "daejeon" },
  { name: "충남", path: "chungnam" },
  { name: "충북", path: "chungbuk" },
  { name: "광주", path: "gwangju" },
];

export const pageColors = {
  mainpage: {
    bg: 'bg-white', 
    ring: 'ring-0',
  },
  regions: {
    bg: "bg-[#8EB2D6]",
    ring: "ring-[#8EB2D6]/80",
  },
  themes: {
    bg: "bg-[#E3CDA4]/80",
    ring: "ring-[#E3CDA4]/70",
  },
  festivals: {
    bg: "bg-teal-600/40",
    ring: "ring-teal-600/30",
  },
  recommended: {
    bg: "bg-blue-500/40",
    ring: "ring-blue-500/30",
  },
  mypage: {
    bg: "bg-[#8EC5D6]",
    ring: "ring-0",
  },
  destination: {
    bg: "bg-blue-200",
    ring: "ring-0",
  },
} as const;

export const placeholderImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEYCAIAAAD9PjcuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAsdJREFUeNrs1DENAAAIwDDAvzkOLsygg6SVsGPZswHwQUkAGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBZgWBIAhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYF/HcCDAANqASx22VIMwAAAABJRU5ErkJggg==';

export const CATEGORIES: CategoryMapping = {
  A01: {
    name: '자연',
    subCategories: {
      A0101: {
        name: '자연관광지',
        details: {
          A01010100: '국립공원',
          A01010200: '도립공원',
          A01010300: '군립공원',
          A01010400: '산',
          A01010500: '자연생태관광지',
          A01010600: '자연휴양림',
          A01010700: '수목원',
          A01010800: '폭포',
          A01010900: '계곡',
          A01011000: '약수터',
          A01011100: '해안절경',
          A01011200: '해수욕장',
          A01011300: '섬',
          A01011400: '항구/포구',
          A01011600: '등대',
          A01011700: '호수',
          A01011800: '강',
          A01011900: '동굴',
        },
      },
    },
  },
  A02: {
    name: '인문(문화/예술/역사)',
    subCategories: {
      A0201: {
        name: '역사관광지',
        details: {
          A02010100: '고궁',
          A02010200: '성',
          A02010300: '문',
          A02010400: '고택',
          A02010500: '생가',
          A02010600: '민속마을',
          A02010700: '유적지/사적지',
          A02010800: '사찰',
          A02010900: '종교성지',
          A02011000: '안보관광',
        },
      },
      A0202: {
        name: '휴양관광지',
        details: {
          A02020200: '관광단지',
          A02020300: '온천/욕장/스파',
          A02020400: '이색찜질방',
          A02020500: '헬스투어',
          A02020600: '테마공원',
          A02020700: '공원',
          A02020800: '유람선/잠수함관광',
        },
      },
      A0203: {
        name: '체험관광지',
        details: {
          A02030100: '농.산.어촌 체험',
          A02030200: '전통체험',
          A02030300: '산사체험',
          A02030400: '이색체험',
          A02030600: '이색거리',
        },
      },
      A0207: {
        name: '축제',
        details: {
          A02070100: '문화관광축제',
          A02070200: '일반축제',
        },
      },
    },
  },
  A03: {
    name: '레포츠',
    subCategories: {
      A0301: {
        name: '레포츠소개',
        details: {
          A03010200: '수상레포츠',
          A03010300: '항공레포츠',
        },
      },
      A0302: {
        name: '육상 레포츠',
        details: {
          A03020200: '수련시설',
          A03020300: '경기장',
          A03020400: '인라인(실내 인라인 포함)',
          A03020500: '자전거하이킹',
          A03020600: '카트',
          A03020700: '골프',
          A03020800: '경마',
          A03020900: '경륜',
          A03021000: '카지노',
          A03021100: '승마',
          A03021200: '스키/스노보드',
          A03021300: '스케이트',
          A03021400: '썰매장',
          A03021500: '수렵장',
          A03021600: '사격장',
          A03021700: '야영장,오토캠핑장',
          A03021800: '암벽등반',
          A03022000: '서바이벌게임',
          A03022100: 'ATV',
          A03022200: 'MTB',
          A03022300: '오프로드',
          A03022400: '번지점프',
          A03022600: '스키(보드) 렌탈샵',
          A03022700: '트래킹',
        },
      },
      A0303: {
        name: '수상 레포츠',
        details: {
          A03030100: '윈드서핑/제트스키',
          A03030200: '카약/카누',
          A03030300: '요트',
          A03030400: '스노쿨링/스킨스쿠버다이빙',
          A03030500: '민물낚시',
          A03030600: '바다낚시',
          A03030700: '수영',
          A03030800: '래프팅',
        },
      },
      A0304: {
        name: '항공 레포츠',
        details: {
          A03040100: '스카이다이빙',
          A03040200: '초경량비행',
          A03040300: '헹글라이딩/패러글라이딩',
          A03040400: '열기구',
        },
      },
      A0305: {
        name: '복합 레포츠',
        details: {
          A03050100: '복합 레포츠',
        },
      },
    },
  },
};

export const fontSpoqaHanSansNeo = localFont({
  src: [
    {
      path: '../assets/fonts/SpoqaHanSansNeo-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/SpoqaHanSansNeo-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/SpoqaHanSansNeo-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/SpoqaHanSansNeo-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
});

export const CharacterIconData = [
  '/assets/image/characters/m1.png', '/assets/image/characters/m2.png', '/assets/image/characters/m3.png', '/assets/image/characters/m4.png', '/assets/image/characters/m5.png',
  '/assets/image/characters/w1.png', '/assets/image/characters/w2.png', '/assets/image/characters/w3.png', '/assets/image/characters/w4.png', '/assets/image/characters/w5.png',
];