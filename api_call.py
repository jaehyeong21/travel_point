import csv
import requests
from dotenv import load_dotenv
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

# .env 파일에서 환경 변수 로드
load_dotenv()

# 카카오 REST API 키 설정
KAKAO_REST_KEY = os.getenv("KAKAO_REST_KEY")

# CSV 파일 경로 설정
input_csv_file_path = './Restaurant_Rank.csv'
output_csv_file_path = './Updated_Restaurant_Rank.csv'

def get_restaurant_details_from_kakao(query):
    headers = {
        'Authorization': f'KakaoAK {KAKAO_REST_KEY}'
    }
    params = {
        'query': query,
        'size': 1
    }
    response = requests.get('https://dapi.kakao.com/v2/local/search/keyword.json', headers=headers, params=params)
    if response.status_code == 200:
        documents = response.json().get('documents', [])
        if documents:
            document = documents[0]
            return {
                'latitude': document.get('y'),
                'longitude': document.get('x'),
                'url': document.get('place_url'),
                'phone': document.get('phone')
            }
    print(f"Error fetching details for query '{query}': {response.json()}")
    return None

def read_csv_and_get_details(file_path):
    results = []
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        fieldnames = reader.fieldnames + ['latitude', 'longitude', 'url', 'phone']
        total_rows = sum(1 for row in reader)
        csvfile.seek(0)
        next(reader)  # Skip header row
        with ThreadPoolExecutor(max_workers=10) as executor:  # Adjust the number of workers as needed
            future_to_row = {executor.submit(get_restaurant_details_from_kakao, row['title']): row for row in reader}
            completed_tasks = 0
            for future in as_completed(future_to_row):
                row = future_to_row[future]
                try:
                    details = future.result()
                    if not details:
                        details = get_restaurant_details_from_kakao(row['location'])  # Retry with location if title fails
                    if details:
                        row.update({
                            'latitude': details['latitude'],
                            'longitude': details['longitude'],
                            'url': details['url'],
                            'phone': details['phone']
                        })
                    else:
                        row.update({
                            'latitude': '',
                            'longitude': '',
                            'url': '',
                            'phone': ''
                        })
                except Exception as exc:
                    print(f"Error retrieving details for {row['title']}: {exc}")
                    row.update({
                        'latitude': '',
                        'longitude': '',
                        'url': '',
                        'phone': ''
                    })
                results.append(row)
                completed_tasks += 1
                print(f"Progress: {completed_tasks}/{total_rows} ({(completed_tasks / total_rows) * 100:.2f}%)")
    return results, fieldnames

def write_updated_csv(file_path, data, fieldnames):
    with open(file_path, mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

# 메인 함수
def main():
    updated_data, fieldnames = read_csv_and_get_details(input_csv_file_path)
    write_updated_csv(output_csv_file_path, updated_data, fieldnames)
    print(f"Updated data has been written to {output_csv_file_path}")

if __name__ == "__main__":
    main()
