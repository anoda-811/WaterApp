"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 60; // 秒

export default function EmomCircle() {
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [setCount, setSetCount] = useState(1);
  const [repCount, setRepCount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevTimeRef = useRef(timeLeft);

  useEffect(() => {
    if (running && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          return prev === 1 ? DURATION : prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  useEffect(() => {
    if (prevTimeRef.current === 1 && timeLeft === DURATION && running) {
      setSetCount((s) => s + 1);
    }
    prevTimeRef.current = timeLeft;
  }, [timeLeft, running]);

  // 円ゲージ計算
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / DURATION;
  const offset = circumference * (1 - progress);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black text-white">

      <h1 className="text-xl">EMOM</h1>

      {/* 円タイマー */}
      <svg width="200" height="200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="#333"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="#00f"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="32"
          fill="white"
        >
          {timeLeft}
        </text>
      </svg>

      {/* 情報 */}
      <div className="flex gap-6 mt-5">
        <div className="w-22 bg-gray-900 px-6 py-4 rounded-xl text-center shadow-lg">
          <div className="text-xs text-gray-400">SET</div>
          <div className="text-3xl font-bold text-blue-400">{setCount}</div>
        </div>

        <div className="w-22 bg-gray-900 px-6 py-4 rounded-xl text-center shadow-lg">
          <div className="text-xs text-gray-400">REPS</div>
          <div className="text-3xl font-bold text-green-400">{repCount}</div>
        </div>
      </div>

      {/* 操作 */}
      <div className="flex gap-6 mt-6">

      {/* START */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => setRunning(true)}
          className="
            w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-xl
            transition-all duration-200
            hover:scale-110
            hover:shadow-[0_0_20px_#22c55e]
            active:scale-95
          "
        >
          ▶
        </button>
        <span className="text-xs mt-2 text-gray-400">START</span>
      </div>

      {/* STOP */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => setRunning(false)}
          className="
            w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-xl
            transition-all duration-200
            hover:scale-110
            hover:shadow-[0_0_20px_#ef4444]
            active:scale-95
          "
        >
          ■
        </button>
        <span className="text-xs mt-2 text-gray-400">STOP</span>
      </div>

      {/* RESET */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => setShowConfirm(true)}
          className="
            w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center text-white text-xl
            transition-all duration-200
            hover:scale-110
            hover:shadow-[0_0_20px_#9ca3af]
            active:scale-95
          "
        >
          ↺
        </button>
        <span className="text-xs mt-2 text-gray-400">RESET</span>
      </div>

    </div>

      {/* 回数ボタン */}
      <div className="flex gap-6 mt-3">

        {/* − */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setRepCount((c) => Math.max(0, c - 1))}
            className="
              w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-white text-xl
              transition-all duration-200
              hover:scale-110
              hover:shadow-[0_0_20px_#9ca3af]
              active:scale-95
            "
          >
            −
          </button>
          <span className="text-xs mt-2 text-gray-400">MINUS</span>
        </div>

        {/* ＋ */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setRepCount((c) => c + 1)}
            className="
              w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl
              transition-all duration-200
              hover:scale-110
              hover:shadow-[0_0_25px_#3b82f6]
              active:scale-95
            "
          >
            ＋
          </button>
          <span className="text-xs mt-2 text-gray-400">ADD</span>
        </div>

        {/* リセット */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setRepCount(0)}
            className="
              w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white
              transition-all duration-200
              hover:scale-110
              hover:shadow-[0_0_20px_#ef4444]
              active:scale-95
            "
          >
            ↺
          </button>
          <span className="text-xs mt-2 text-gray-400">CLEAR</span>
        </div>

      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          
          <div className="bg-gray-900 p-6 rounded-xl text-center">
            <p className="mb-4 text-lg">リセットしますか？</p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setRunning(false);
                  setTimeLeft(DURATION);
                  setSetCount(1);
                  setRepCount(0);
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-red-500 rounded"
              >
                はい
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                いいえ
              </button>
            </div>
          </div>

        </div>
      )}

    </main>
  );
}