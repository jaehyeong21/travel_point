import { PrismaClient } from "@prisma/client";

// 버전에 따라 undefined 에러가 날 경우 작성.
declare global {
  var client : PrismaClient | undefined;
}

// PrismaClient가 global에 없는 경우에만 인스턴스화(한 번만 실행)
const client = global.client ||  new PrismaClient();

// 프로덕션 상태가 아닐 때(즉, 개발 중 일때) globalThis 개체에 저장
if(process.env.NODE_ENV === 'development') global.client = client;

export default client;