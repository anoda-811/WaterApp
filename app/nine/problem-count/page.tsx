"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProblemCount() {
  const searchParams = useSearchParams();
  const total = Number(searchParams.get("count")) || 10;

  const [phase, setPhase] = useState<"flash" | "countdown" | "playing" | "result">("flash");
  const [countdown, setCountdown] = useState(3);

  const [current, setCurrent] = useState(1);
  const [left, setLeft] = useState(1);
  const [right, setRight] = useState(1);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);

  const generateQuestion = () => {
    setLeft(Math.floor(Math.random() * 9) + 1);
    setRight(Math.floor(Math.random() * 9) + 1);
  };

  // 演出制御
  useEffect(() => {
    if (phase === "flash") {
      const flashTimer = setTimeout(() => {
        setPhase("countdown");
      }, 200);
      return () => clearTimeout(flashTimer);
    }

    if (phase === "countdown") {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase("playing");
        generateQuestion();
      }
    }
  }, [phase, countdown]);

  const handleSubmit = () => {
    if (Number(input) === left * right) {
      setScore((prev) => prev + 1);
    }

    if (current < total) {
      setCurrent((prev) => prev + 1);
      setInput("");
      generateQuestion();
    } else {
      setPhase("result");
    }
  };

  // 🔥 フラッシュ画面
  if (phase === "flash") {
    return <div className="fixed inset-0 bg-white"></div>;
  }

  // 🔥 カウントダウン画面
  if (phase === "countdown") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-7xl font-bold animate-pulse">
        {countdown}
      </div>
    );
  }

  // 🔥 結果画面
  if (phase === "result") {
    const router = useRouter();

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="border-2 border-white p-10 text-center w-80">
          <h2 className="text-3xl mb-6">結果</h2>

          <p className="text-xl tracking-wider">
            正解数: {score} / {total}
          </p>
        </div>
        <button
            onClick={() => router.push("/nine")}
            className="
            px-8 py-3
            bg-black text-white
            rounded-xl
            mt-8 text-lg tracking-widest
            transition
            hover:shadow-[0_0_12px_white]
            hover:bg-white
            hover:text-black
            transition-all duration-200
            active:shadow-[0_0_20px_white]
            active:bg-white
            active:text-black
            "
          >
            ▶ タイトルへ
          </button>
      </div>
    );
  }

  // 🔥 通常問題画面
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="border-2 border-white p-8 w-80 text-center">
        <p className="mb-4">
          問題 {current} / {total}
        </p>

        <div className="text-4xl mb-6">
          {left} × {right} = ?
        </div>

        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          className="bg-black border-2 border-white text-white text-center p-2 w-24"
        />
      </div>
    </div>
  );
}