"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function TimeAttack(){
    const searchParams = useSearchParams();
    const seconds = Number(searchParams.get("seconds") ?? 60);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [phase, setPhase] = useState<"flash" | "countdown" | "playing" | "result">("flash");
    const [countdown, setCountdown] = useState(3);
    const [left, setLeft] = useState(1);
    const [right, setRight] = useState(1);
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(seconds * 1000);
    const correctAnswer = left * right;

    const generateQuestion = () => {
        setLeft(Math.floor(Math.random() * 9) + 1);
        setRight(Math.floor(Math.random() * 9) + 1);
    };

    // サウンド
    const playSound = (type: "correct" | "wrong") => {
        const sound = new Audio(`/sounds/${type}.mp3`);
        sound.volume = 0.5; // 音量調整
        sound.play();
    };

    // 判定
    const handleSubmit = (answer?: string) => {
        const finalAnswer = answer ?? input;
        if (Number(finalAnswer) === correctAnswer) {
        setScore((prev) => prev + 1);
        playSound("correct");
        } else {
        playSound("wrong");
        }

        setInput("");
        generateQuestion();
    };

    // リトライ
    const retry = () => {
    setPhase("flash");
    setCountdown(3);
    setScore(0);
    setInput("");
    setTimeLeft(seconds * 1000);
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

    // タイマー
    useEffect(() => {
        if (phase !== "playing") return;

        if (timeLeft <= 0) {
            setPhase("result");
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((prev) => prev - 10);
        }, 10);

        return () => clearTimeout(timer);
    }, [phase, timeLeft]);

    useEffect(() => {
        setTimeLeft(seconds * 1000);
    }, [seconds]);

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
        return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
            <div className="border-2 border-white p-10 text-center w-80">
            <h2 className="text-3xl mb-6">結果</h2>

            <p className="text-xl tracking-wider">
                正解数: {score}
            </p>
            </div>
            <div className="mt-8 flex flex-col items-center">
            <button
                onClick={retry}
                className="
                px-8 py-3
                text-left w-48
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
                ▶ リトライ
            </button>
            <button
                onClick={() => router.push("/nine")}
                className="
                    px-8 py-3
                    text-left w-48
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
        </div>
        );
    }

    // 🔥 通常問題画面
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
            <p
                className={`mb-4 text-2xl tracking-widest ${
                    timeLeft <= 10000 ? "text-red-500" : "text-white"
                }`}
            >
              {(timeLeft / 1000).toFixed(2)}
            </p>
        <div className="border-2 border-white p-8 w-80 text-center">
            <div className="text-4xl mb-6">
            {left} × {right} = ?
            </div>

            <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            autoFocus
            value={input}
            onChange={(e) => {
                const value = e.target.value;

                if (/^\d*$/.test(value)) {
                setInput(value);

                if (value.length === String(correctAnswer).length) {
                    handleSubmit(value);
                }
                }
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                handleSubmit(input);
                }
            }}
            className="bg-black border-2 border-white text-white text-center p-2 w-24"
            />
        </div>
        </div>
    );
}

// 保管庫
// ${timeLeft <= 5000 ? "animate-pulse" : ""}