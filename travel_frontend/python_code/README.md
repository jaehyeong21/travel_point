# 파이썬으로 백엔드 작업

## 음식점 데이터 받아오는 방법

- 1. 환경 설정

```.env
CRAWLING_ID=
CRAWLING_PS=
CONNECTION_SQL=
KAKAO_REST_KEY=
```

- 2. 데이터 크롤링 -> 카카오 API를 이용한 데이터 추가 -> DataFrame to MySql

```bash
python crawling.py
python api_call.py
python df_to_sql.py
```

## 서치인덱스 파싱

- 서치 인덱스 파싱 -> web_nextjs/public 폴더에 searchIndex.json.gz 옮기기

```bash
python searchIndex.py
```
