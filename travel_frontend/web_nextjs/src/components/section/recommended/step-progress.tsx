
export default function StepProgress({ step }: { step: number }) {
  const steps = ['시작하기', '지역 선택', '취향 설정', '여행지 브루마블', '결과 확인'];
  return (
    <div id="progress" className="mb-8 container">
      <h2 className="sr-only">단계</h2>
      <ol className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs font-medium text-gray-500">
        {steps.map((title, index) => (
          <li key={title} className="flex items-center gap-2">
            {index + 1 < step ? (
              <span className="rounded bg-green-100/80 p-1.5 text-green-700/90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            ) : (
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${index + 1 === step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                } text-center text-xs font-bold`}
              >
                {index + 1}
              </span>
            )}
            <span className={`${index + 1 === step ? 'text-blue-600' : 'text-gray-600'} text-xs sm:text-sm`}>{title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}