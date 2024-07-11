import pandas as pd
from sqlalchemy import create_engine, text, inspect
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# MySQL 연결 정보 설정
connection_string = os.getenv("CONNECTION_SQL")
if connection_string is None:
    raise ValueError("CONNECTION_SQL 환경 변수를 찾을 수 없습니다. .env 파일을 확인하세요.")

# SQLAlchemy 엔진 생성
engine = create_engine(connection_string)

# MySQL에 접속하여 데이터베이스와 테이블 생성
with engine.connect() as connection:
    with connection.begin() as transaction:
        # 데이터베이스 사용
        connection.execute(text("USE travel;"))
        
        # 기존 테이블 삭제
        drop_table_query = text("DROP TABLE IF EXISTS Restaurant;")
        connection.execute(drop_table_query)
        
        # 테이블 생성
        create_table_query = text("""
        CREATE TABLE Restaurant (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ranking INT,
            title VARCHAR(255),
            province VARCHAR(255),
            city VARCHAR(255),
            location VARCHAR(255),
            cat2 VARCHAR(255),
            cat3 VARCHAR(255),
            visitors INT,
            latitude FLOAT,
            longitude FLOAT,
            url VARCHAR(255),
            phone VARCHAR(255)
        );
        """)
        connection.execute(create_table_query)

# CSV 파일 읽기
csv_file = './Updated_Restaurant_Rank.csv'
df = pd.read_csv(csv_file)

# 'visitors' 컬럼의 쉼표를 제거하고 정수로 변환
df['visitors'] = df['visitors'].str.replace(',', '').astype(int)

# 데이터베이스 테이블에 데이터 삽입
table_name = 'Restaurant'
inspector = inspect(engine)
df.to_sql(name=table_name, con=engine, if_exists='append', index=False)
print(f"CSV 파일의 내용이 {table_name} 테이블에 성공적으로 저장되었습니다.")
