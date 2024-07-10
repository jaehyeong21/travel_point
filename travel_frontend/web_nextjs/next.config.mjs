/** @type {import('next').NextConfig} */

const nextConfig = {
  compress: true,
  swcMinify: true,
  productionBrowserSourceMaps: true,
  // 프록시할 외부 API의 주소를 /api/로 변경
  async rewrites() {
    return [
      {
        source: "/api/upload-image",
        destination: "/api/upload-image",
      },
      {
        source: "/api/restaurants",
        destination: "/api/restaurants",
      },
      {
        source: "/api/:path*",
        destination: "https://pingulion.shop/:path*", // 프록시할 외부 API의 주소
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000", // 개발 서버의 기본 URL을 설정
  },
  // 이미지 최적화
  images: {
    deviceSizes: [640, 800, 1920],
    imageSizes: [300, 220, 250],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "tong.visitkorea.or.kr",
        pathname: "/cms/resource/**",
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        pathname: "/ftV1RpijrL892iGuP8Q6zQ/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60, // 이미지 캐시 최소 시간 설정
  },
  // 정적 파일 제공 최적화
  staticPageGenerationTimeout: 60, // 정적 페이지 생성 타임아웃 설정
};

export default nextConfig;
