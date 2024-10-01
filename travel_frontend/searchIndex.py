# 검색에 필요한 searchIndex.json 파일을 수정 & .gz로 압축하는 코드입니다.
import json
import gzip

# 파일 경로 설정
input_file_path = './searchIndex.json'  # 입력 파일 경로 설정
output_file_path = './searchIndex.json.gz'  # 출력 파일 경로 설정

# JSON 파일 읽기 및 gzip으로 압축하여 저장
with open(input_file_path, 'r', encoding='utf-8') as f_in:
    data = json.load(f_in)

    # 필요한 필드만 남기기
    minified_data = [
        {
            "id": item["contentId"],
            "name": item["title"],
            "subtitle": item["location"]
        }
        for item in data
    ]

    # 새로운 간소화된 JSON 파일을 gzip으로 압축하여 저장
    with gzip.open(output_file_path, 'wt', encoding='utf-8') as f_out:
        json.dump(minified_data, f_out, ensure_ascii=False, separators=(',', ':'))

print("간소화된 JSON 파일이 gzip으로 압축되었습니다.")
