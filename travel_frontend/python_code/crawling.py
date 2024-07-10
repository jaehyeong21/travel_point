from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import pandas as pd
import os
from dotenv import load_dotenv

# WebDriver 설정
driver_path = './chromedriver'  # ChromeDriver의 경로
service = Service(driver_path)

# Chrome 옵션 설정
options = Options()
# options.add_argument('--headless')  # 헤드리스 모드 설정
options.add_argument('--disable-gpu')  # GPU 비활성화
options.add_argument('--no-sandbox')  # 샌드박스 모드 비활성화 (Linux에서 필요할 수 있음)
options.add_argument('--disable-dev-shm-usage')  # /dev/shm 사용 비활성화 (Linux에서 필요할 수 있음)

driver = webdriver.Chrome(service=service, options=options)

# 로그인 함수
def login(username, password):
    print("Navigating to main page...")
    driver.get('https://datalab.visitkorea.or.kr/datalab/portal/main/getMainForm.do')
    
    print("Clicking login button...")
    login_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//a[@class='btn_login border-right']"))
    )
    login_button.click()
    time.sleep(5)
    
    print("Entering username...")
    username_input = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "mbrId"))
    )
    username_input.send_keys(username)

    print("Entering password...")
    password_input = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "mbrPw"))
    )
    password_input.send_keys(password)

    print("Submitting login form...")
    login_submit = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[type='submit']"))
    )
    login_submit.click()
    time.sleep(5)

# 사용자 계정 정보
username = os.getenv("CRAWLING_ID")
password = os.getenv("CRAWLING_PS")

# 로그인 시도
login(username, password)

# 로그인 후 대기
time.sleep(5)

print("Navigating to target page...")
# 지정된 URL로 이동
driver.get('https://datalab.visitkorea.or.kr/datalab/portal/bda/getTourVisitCnt.do')

# 지역 선택 및 데이터 크롤링 함수
def select_area_and_crawl(region, cities):
    for city in cities:
        print(f"Selecting area: {region}, {city}")
        # 1. 지역 선택 -> 모달창 켜짐
        area_select = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "area-select"))
        )
        area_select.click()
        time.sleep(1)  # 추가 로딩 시간 대기

        print(f"Selecting region: {region}")
        # 2. 모달창에서 '광역시/도' 중 선택
        region_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, f"//a[text()='{region}']"))
        )
        region_button.click()
        time.sleep(1)  # 추가 로딩 시간 대기

        print(f"Selecting city: {city}")
        # 3. 모달창에서 '시/군/구' 중 선택
        # city_button을 클릭하기 전에 요소를 다시 찾도록 수정
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f"//a[text()='{city}']"))
        )
        city_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, f"//a[text()='{city}']"))
        )
        city_button.click()
        time.sleep(1)  # 추가 로딩 시간 대기

        print("Confirming selection...")
        # 4. 모달창에서 '확인' 선택
        confirm_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//a[@class='button bg-blue modal-close' and text()='확인']"))
        )
        confirm_button.click()
        time.sleep(1)  # 추가 로딩 시간 대기

        print("Selecting '음식' category...")
        # 5. '음식' 선택
        food_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//a[text()='음식']"))
        )
        food_button.click()
        time.sleep(15)  # 추가 로딩 시간 대기
        
        print("Waiting for results to load...")
        # 6. 결과값 로딩 대기 후 상위 12개 저장
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "tbody_tvcnt"))
        )
        time.sleep(2)  # 추가 로딩 시간 대기

        print("Extracting data...")
        rows = driver.find_elements(By.CSS_SELECTOR, "#tbody_tvcnt tr")[:12]
        data = []
        for row in rows:
            cols = row.find_elements(By.TAG_NAME, "td")
            data.append([col.text for col in cols])

        # 데이터 저장
        save_data(data)
        time.sleep(1)  # 추가 로딩 시간 대기


def save_data(data):
    # 기존 데이터를 불러오거나 새로운 데이터프레임 생성
    try:
        df = pd.read_csv('Restaurant_Rank.csv')
    except FileNotFoundError:
        df = pd.DataFrame(columns=['ranking', 'title', 'province', 'city', 'location', 'cat2', 'cat3', 'visitors'])

    # 새 데이터 추가
    new_df = pd.DataFrame(data, columns=['ranking', 'title', 'province', 'city', 'location', 'cat2', 'cat3', 'visitors'])
    df = pd.concat([df, new_df], ignore_index=True)

    # CSV 파일로 저장
    df.to_csv('Restaurant_Rank.csv', index=False)

# 전체 지역 목록 - 부천 제외(에러)
regions_cities = {
    '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구',
               '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구',
               '용산구', '은평구', '종로구', '중구', '중랑구'],
    '부산광역시': ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구',
               '연제구', '영도구', '중구', '해운대구'],
    '대구광역시': ['군위군', '남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
    '인천광역시': ['강화군', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구'],
    '광주광역시': ['광산구', '남구', '동구', '북구', '서구'],
    '대전광역시': ['대덕구', '동구', '서구', '유성구', '중구'],
    '울산광역시': ['남구', '동구', '북구', '울주군', '중구'],
    '경기도': ['가평군', '고양시 덕양구', '고양시 일산동구', '고양시 일산서구', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시',
            '남양주시', '동두천시', '성남시 분당구', '성남시 수정구', '성남시 중원구',
            '수원시 권선구', '수원시 영통구', '수원시 장안구', '수원시 팔달구', '시흥시', '안산시 단원구', '안산시 상록구', '안성시', '안양시 동안구',
            '안양시 만안구', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시 기흥구', '용인시 수지구', '용인시 처인구', '의왕시', '의정부시',
            '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'],    
    '강원특별자치도': ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군',
                   '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'],
    '충청북도': ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '증평군', '진천군', '청주시 상당구',
             '청주시 서원구', '청주시 청원구', '청주시 흥덕구', '충주시'],
    '충청남도': [ '청양군', '태안군', '홍성군'],
    '전북특별자치도': ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군',
                 '장수군', '전주시 덕진구', '전주시 완산구', '정읍시', '진안군'],
    '전라남도': ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군',
             '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군',
             '해남군', '화순군'],
    '경상북도': ['경산시', '경주시', '고령군', '구미시', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시',
             '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군', '울진군', '의성군', '청도군', '청송군',
             '칠곡군', '포항시 남구', '포항시 북구'],
    '경상남도': ['거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군',
             '진주시', '창녕군', '창원시 마산합포구', '창원시 마산회원구', '창원시 성산구', '창원시 의창구', '창원시 진해구',
             '통영시', '하동군', '함안군', '함양군', '합천군'],
    '제주특별자치도': ['서귀포시', '제주시']
}

# 지역 선택 및 데이터 크롤링 수행
for region, cities in regions_cities.items():
    select_area_and_crawl(region, cities)

# 브라우저 종료
print("Quitting browser...")
driver.quit()
print("Done.")
