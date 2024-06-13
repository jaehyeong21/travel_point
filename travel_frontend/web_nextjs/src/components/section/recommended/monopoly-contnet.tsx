'use client';

import { useState, useMemo } from "react";
import { FaChessPawn } from "react-icons/fa6";
import Dice from "@/components/section/recommended/dice";
import { useFetchThemeDestinationByCat } from "@/hooks/use-fetch-destination";
import { REGIONS } from "@/data/data";
import { DestinationType } from "@/types/destination-types";
import { useRecommendStore } from "@/store/recommendStore";
import { ThemeType } from "@/types/categoriy-types";

interface MonopolyContentProps {
  areaName: string;
  theme: ThemeType;
  setIsGameCompleted: (completed: boolean) => void;
}

export default function MonopolyContent({ theme, areaName, setIsGameCompleted }: MonopolyContentProps) {
  const regionPath = REGIONS.find((r) => r.name === areaName)?.path || '';
  const { data } = useFetchThemeDestinationByCat({ areaName: regionPath, count: '24', theme: theme, page: '1', random: 'true' });

  const { setMovedPositions, movedPositions: previousMovedPositions } = useRecommendStore((state) => ({
    setMovedPositions: state.setMovedPositions,
    movedPositions: state.movedPositions,
  }));

  const boardCols = 7;
  const boardRows = 7;

  // 게임 보드의 경로를 정의합니다
  const path = useMemo(() => [
    48, 47, 46, 45, 44, 43, 42,
    35, 28, 21, 14, 7, 0,
    1, 2, 3, 4, 5, 6,
    13, 20, 27, 34, 41,
  ], []);

  // 각 셀의 내용을 담은 맵을 생성합니다
  const cells = useMemo(() => {
    const cellMap = new Map<number, string>();
    path.forEach((pos, index) => {
      if (data) {
        cellMap.set(pos, data.destinations[index]?.title || '');
      }
    });
    return cellMap;
  }, [data, path]);

  const [currentPosition, setCurrentPosition] = useState(48); // 말의 초기 위치
  const [isMoving, setIsMoving] = useState(false); // 말이 움직이는 중인지 여부를 나타내는 상태
  const [board, setBoard] = useState(Array(boardCols * boardRows).fill('white')); // 초기 보드 상태

  // 셀의 내용을 가져오는 함수
  const getCellContent = (index: number) => {
    const content = cells.get(index) || '';
    const needsPadding = content.length > 6;
    return { content: needsPadding ? content.substring(0, 6) + '...' : content, needsPadding };
  };

  // 셀이 경계 셀인지 확인하는 함수
  const isEdgeCell = (index: number) => path.includes(index);

  // 주사위 굴리기 함수
  const handleDiceRoll = (diceNumbers: number[]) => {
    if (isMoving) return; // 현재 움직이는 중이면 주사위 굴리기를 중단합니다
    setIsMoving(true); // 움직이는 중 상태로 설정

    setTimeout(() => {
      moveTokens(diceNumbers);
    }, 200);
  };

  // 주사위 숫자에 따라 말을 이동시키는 함수
  const moveTokens = (diceNumbers: number[]) => {
    let newBoard = [...board];
    let currentPositionIndex = path.indexOf(currentPosition);
    let movedPositions: DestinationType[] = [...previousMovedPositions];
    let totalDelay = 0;

    diceNumbers.forEach((diceNumber) => {
      for (let i = 1; i <= diceNumber; i++) {
        totalDelay += 500;
        setTimeout(() => {
          currentPositionIndex = (currentPositionIndex + 1) % path.length;
          const newPosition = path[currentPositionIndex];
          setCurrentPosition(newPosition);
          if (i === diceNumber) {
            newBoard[newPosition] = 'bg-green-100/70';
            const dataIndex = path.indexOf(newPosition);
            if (data && data.destinations[dataIndex]) {
              const position = data.destinations[dataIndex];
              if (!movedPositions.some(item => item.title === position.title)) {
                movedPositions.push(position);
              }
            }
          }
          setBoard([...newBoard]);
        }, totalDelay);
      }
      totalDelay += 500;
    });

    setTimeout(() => {
      setIsMoving(false);
      setMovedPositions(movedPositions);
      setIsGameCompleted(true); // 게임 완료 상태를 true로 설정
      console.log(movedPositions);
    }, totalDelay);
  };

  // 보드의 각 셀을 렌더링하는 함수
  const renderBoardCell = (i: number) => {
    const { content, needsPadding } = getCellContent(i);
    return (
      <div
        key={i}
        className={`md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px] ring-[1px] flex items-center justify-center border ${isEdgeCell(i) ? 'border-gray-600 shadow-lg' : 'invisible'} ${board[i] === 'bg-green-100/70' ? 'bg-green-100/70 ring-purple-300/80 ring-[1.5px]' : 'bg-white ring-purple-200/80'}`}
      >
        <div className="transform -rotate-45 flex flex-col items-center ">
          <span className={`truncate-5 sm:truncate-6 ${needsPadding ? 'pl-1.5' : ''}`}>{content}</span>
          {currentPosition === i && (
            <span className='animate-bounce'>
              <FaChessPawn className="text-red-500 text-3xl shadow-xl" />
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative w-full sm:w-[90%] md:w-[110%] h-4/5 px-4 sm:px-0 will-change-contents">
        {/* 큰 화면에서 보드 셀을 렌더링 */}
        <div className="hidden md:grid absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 grid-cols-7 grid-rows-7 gap-1">
          {Array.from({ length: boardCols * boardRows }, (_, i) => renderBoardCell(i))}
        </div>
        {/* 작은 화면에서 보드 셀을 렌더링 */}
        <div className="grid md:hidden grid-cols-7 grid-rows-7 gap-0.5 sm:gap-1 xsm:w-[88%] xsm:mx-auto select-none">
          {Array.from({ length: boardCols * boardRows }, (_, i) => (
            <div
              key={i}
              className={`size-[52px] xsm:size-[60px] sm:size-[70px] flex items-center justify-center border ring-[1px] ${isEdgeCell(i) ? 'border-gray-600 shadow-lg' : 'invisible'} ${board[i] === 'bg-green-100/70' ? 'bg-green-100/70 ring-purple-300/80 ring-[1.5px]' : 'bg-white ring-purple-200/80'}`}
            >
              <div className="flex flex-col items-center">
                <span className={`truncate-5 sm:truncate-6 ${getCellContent(i).needsPadding ? 'pl-1.5' : ''}`}>{getCellContent(i).content}</span>
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
