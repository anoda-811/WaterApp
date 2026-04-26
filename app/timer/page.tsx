"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 60; // 秒

export default function EmomCircle() {
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [setCount, setSetCount] = useState(1);
  const [repCount, setRepCount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [perSet, setPerSet] = useState(5); // 1分あたりの回数
  const [editing, setEditing] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevTimeRef = useRef(timeLeft);

  // サウンド系
  const beep = useRef<HTMLAudioElement | null>(null);
  const finish = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    beep.current = new Audio("/sounds/beep.mp3");
    finish.current = new Audio("/sounds/finish.mp3");
  }, []);

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
    if (!running) return;

    // 3,2,1 のときだけ1回鳴らす
    if (timeLeft <= 3 && timeLeft > 0 && prevTimeRef.current !== timeLeft) {
      new Audio("/sounds/beep.mp3").play();
    }

    // 1 → 60 に戻った瞬間に「ポーン」＋セット加算
    if (prevTimeRef.current === 1 && timeLeft === DURATION) {
      new Audio("/sounds/finish.mp3").play();
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

    <h1
      className={`
        text-5xl tracking-widest font-bold text-white
        transition-all duration-300
        ${running ? "drop-shadow-[0_0_12px_#3b82f6] scale-105" : ""}
      `}
    >
      EMOM
    </h1>
      <p className="text-xs text-gray-400 tracking-widest">
        EVERY MINUTE ON THE MINUTE
      </p>

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

          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          stroke={timeLeft <= 3 ? "#ef4444" : "#3b82f6"}
          className={`
            transition-all duration-300
            ${
              running
                ? timeLeft <= 3
                  ? "drop-shadow-[0_0_10px_#ef4444]"
                  : "drop-shadow-[0_0_10px_#3b82f6]"
                : ""
            }
          `}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="32"
          fill="white"
        className={`
          transition-all duration-300
          ${
            running
              ? timeLeft <= 3
                ? "fill-red-400 drop-shadow-[0_0_10px_#ef4444]"
                : "drop-shadow-[0_0_6px_#fff]"
              : ""
          }
        `}
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

      <div className="mt-4 text-center">

        <div className="text-xs text-gray-400">
          TARGET REPS
        </div>

        {!editing ? (
          <div
            className="text-2xl font-bold text-blue-400 cursor-pointer"
            onClick={() => setEditing(true)}
          >
            {perSet} 回
          </div>
        ) : (
          <input
            type="number"
            value={perSet}
            autoFocus
            onChange={(e) => setPerSet(Number(e.target.value))}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditing(false);
            }}
            className="w-20 text-center bg-gray-800 text-blue-400 text-2xl font-bold rounded"
          />
        )}

      </div>

      {/* 操作 */}
      <div className="flex gap-6 mt-6">

      {/* START */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => {
            setRunning(true);
            new Audio("/sounds/start.mp3").play();
          }}
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
          onClick={() => {
            setRunning(false);
            new Audio("/sounds/stop.mp3").play();
          }}
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
            onClick={() => {
              setRepCount((c) => Math.max(0, c - 1))
              new Audio("/sounds/up.mp3").play();
            }}
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
            onClick={() => {
              setRepCount((c) => c + perSet)
              new Audio("/sounds/up.mp3").play();
            }}
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