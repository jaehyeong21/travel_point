// libs/cookie.ts
interface CookieOptions {
  name: string;
  value: string;
  days?: number;
  hours?: number;
  secure?: boolean;
}

export function setCookie({
  name,
  value,
  days = 0,
  hours = 0,
  secure = false,
}: CookieOptions) {
  const expires = new Date();  // 만료 날짜를 설정하기 위해 현재 날짜를 가져옵니다.

  // days 매개변수가 0보다 크면 일 단위로 만료 날짜를 설정합니다.
  if (days > 0) {
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);  // days를 밀리초로 변환하여 만료 날짜를 설정합니다.
  } 
  // hours 매개변수가 0보다 크면 시간 단위로 만료 날짜를 설정합니다.
  else if (hours > 0) {
    expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);  // hours를 밀리초로 변환하여 만료 날짜를 설정합니다.
  }

  // 쿠키 문자열을 구성합니다.
  let cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;

  // secure 매개변수가 true이면 secure 속성을 추가합니다.
  if (secure) {
    cookieString += ";secure";
  }

  // 구성된 쿠키 문자열을 문서의 쿠키로 설정합니다.
  document.cookie = cookieString;
}

export function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function hasCookie(name: string): boolean {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return true;
  }
  return false;
}


export function deleteCookie(...names: string[]) {
  names.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=Strict`;
  });
}
