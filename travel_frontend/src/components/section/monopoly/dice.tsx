// Dice.tsx
'use client';
import { useState } from 'react';
import '@/styles/dice.css';

interface DiceProps {
  onRoll: (diceNumber: number) => void;
}

// Dice 컴포넌트 정의
const Dice = ({ onRoll }: DiceProps) => {
  const [diceNumber, setDiceNumber] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    if (isRolling) return; // 주사위가 굴러가는 중이면 중복 클릭 방지
    setIsRolling(true);
    const newDiceNumber = Math.floor(Math.random() * 6) + 1;
    setDiceNumber(newDiceNumber);

    setTimeout(() => {
      setIsRolling(false);
      onRoll(newDiceNumber);
    }, 2000);
  };

  return (
    <div className="absolute left-1/2 right-1/2 flex items-center justify-center">
      <div className="flex justify-center items-center h-screen">
        <div
          onClick={rollDice}
          className={`dice show-${diceNumber} ${isRolling ? 'roll-dice' : ''}`}
        >
          <DiceSide sideNumber={1} />
          <DiceSide sideNumber={2} />
          <DiceSide sideNumber={3} />
          <DiceSide sideNumber={4} />
          <DiceSide sideNumber={5} />
          <DiceSide sideNumber={6} />
        </div>
      </div>
    </div>
  );
};

const DiceSide = ({ sideNumber }: { sideNumber: number }) => {
  const dots = getDots(sideNumber);

  return (
    <div className={`side side-${sideNumber}`}>
      {dots.map((dot, index) => (
        <div key={index} className={`dot ${dot.className}`}></div>
      ))}
    </div>
  );
};

const getDots = (sideNumber: number) => {
  const dotPositions: { [key: number]: { className: string }[] } = {
    1: [{ className: "one-1" }],
    2: [
      { className: "two-1" },
      { className: "two-2" }
    ],
    3: [
      { className: "three-1" },
      { className: "three-2" },
      { className: "three-3" }
    ],
    4: [
      { className: "four-1" },
      { className: "four-2" },
      { className: "four-3" },
      { className: "four-4" }
    ],
    5: [
      { className: "five-1" },
      { className: "five-2" },
      { className: "five-3" },
      { className: "five-4" },
      { className: "five-5" }
    ],
    6: [
      { className: "six-1" },
      { className: "six-2" },
      { className: "six-3" },
      { className: "six-4" },
      { className: "six-5" },
      { className: "six-6" }
    ],
  };

  return dotPositions[sideNumber];
};

export default Dice;
