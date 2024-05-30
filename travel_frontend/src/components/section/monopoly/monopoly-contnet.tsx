'use client';

import { useMemo, useState } from "react";
import { FaChessPawn } from "react-icons/fa6";
import Dice from "@/components/section/monopoly/dice";

export function MonopolyContent() {
  const boardCols = 7; // 보드의 열 크기
  const boardRows = 7; // 보드의 행 크기

  // 발판의 순서 정의 (반시계 방향)
  const path = useMemo(() => [
    48, 47, 46, 45, 44, 43, 42, // 아래쪽 가로줄
    35, 28, 21, 14, 7, 0, // 왼쪽 세로줄
    1, 2, 3, 4, 5, 6, // 위쪽 가로줄
    13, 20, 27, 34, 41, // 오른쪽 세로줄    
  ], []);

  // 셀의 내용을 정의
  const cells = useMemo(() => {
    const cellMap = new Map<number, string>();
    path.forEach((pos, index) => {
      if (index === 0) {
        cellMap.set(pos, '<-시작');
      } else {
        cellMap.set(pos, `${index}번`);
      }
    });
    return cellMap;
  }, [path]);

  const [currentPosition, setCurrentPosition] = useState(48); // 현재 위치 상태
  const [isMoving, setIsMoving] = useState(false); // 이동 중 여부 상태

  // 셀의 내용을 가져오는 함수
  const getCellContent = (index: number) => cells.get(index) || '';
  // 보드의 경계 셀인지 확인
  const isEdgeCell = (index: number) => path.includes(index);

  // 주사위 굴림 핸들러
  const handleDiceRoll = (diceNumber: number) => {
    if (isMoving) return;
    setIsMoving(true);

    // 주사위 애니메이션 후 0.1초 후에 말이 움직이기 시작
    setTimeout(() => {
      const newPositionIndex = (path.indexOf(currentPosition) + diceNumber) % path.length; // 새로운 위치 계산
      const newPosition = path[newPositionIndex]; // 새로운 위치 값
      moveToken(newPosition); // 토큰 이동 함수 호출
    }, 100);
  };

  // 토큰을 이동시키는 함수
  const moveToken = (end: number) => {
    const startIndex = path.indexOf(currentPosition); // 현재 위치 인덱스
    const endIndex = path.indexOf(end); // 목표 위치 인덱스
    const distance = (endIndex >= startIndex) ? endIndex - startIndex : path.length - startIndex + endIndex; // 이동 거리 계산

    for (let i = 0; i <= distance; i++) {
      setTimeout(() => {
        setCurrentPosition(path[(startIndex + i) % path.length]); // 토큰의 새로운 위치 설정
        if (i === distance) setIsMoving(false); // 마지막 이동 후 이동 상태 해제
      }, i * 500); // 0.5초 간격으로 토큰 이동
    }
  };

  // 보드 셀을 렌더링하는 함수
  const renderBoardCell = (i: number) => (
    <div
      key={i}
      className={`md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px] flex items-center justify-center border bg-white ${isEdgeCell(i) ? 'border-gray-600 shadow-lg' : 'invisible'}`}
    >
      <div className="transform -rotate-45 flex flex-col items-center">
        <span className="font-semibold truncate">{getCellContent(i)}</span>
        {currentPosition === i && (
          <span className='animate-bounce'>
            <FaChessPawn className="text-red-500 text-3xl shadow-xl" />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="relative w-full sm:w-[90%] md:w-[110%] h-4/5 px-4 sm:px-0">
        {/* md 이상일 때 보드 렌더링 */}
        <div className="hidden md:grid absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 grid-cols-7 grid-rows-7 gap-1">
          {Array.from({ length: boardCols * boardRows }, (_, i) => renderBoardCell(i))}
        </div>
        {/* md 이하일 때 보드 렌더링 */}
        <div className="grid md:hidden grid-cols-7 grid-rows-7 gap-0.5 sm:gap-1 xsm:w-[88%] xsm:mx-auto">
          {Array.from({ length: boardCols * boardRows }, (_, i) => (
            <div
              key={i}
              className={`size-[56px] xsm:size-[60px] sm:size-[70px] flex items-center justify-center border bg-white ${isEdgeCell(i) ? 'border-gray-600 shadow-lg' : 'invisible'}`}
            >
              <div className="flex flex-col items-center">
                <span className="text-sm sm:text-lg font-semibold">{getCellContent(i)}</span>
                {currentPosition === i && (
                  <FaChessPawn className="text-red-500 text-2xl animate-bounce" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dice onRoll={handleDiceRoll} />
    </>
  );
}
