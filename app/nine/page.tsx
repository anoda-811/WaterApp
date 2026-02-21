"use client";

import Link from "next/link";
import { Zen_Old_Mincho } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";

const zenOld = Zen_Old_Mincho({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
    const [mode, setMode] = useState<"count" | "time" | null>(null);
    const [value, setValue] = useState<number | null>(null);
    const router = useRouter();
    const handleStart = () => {
        if (!mode || !value) return;

        if (mode === "count") {
        router.push(`/nine/problem-count?count=${value}`);
        } else {
        router.push(`/nine/time-attack?seconds=${value}`);
        }
    };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        {/* ヘッダー */}
            <div className="flex items-left py-2 md:py-4">
                <Link
                href="/"
                className="            px-8 py-3
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
            active:text-black"
                >
                ← Home
                </Link>
            </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-6">

        <h1 className={`${zenOld.className} text-5xl mb-10 tracking-widest text-white`}>
            九九道場
        </h1>

        {/* 問題数 */}
        <div className="border-2 border-white rounded-2xl p-6 mb-8 w-80 text-center hover:shadow-[0_0_10px_white] transition">
            <h2 className="mb-4 font-semibold text-white">✑ 問題数アタック</h2>
            <div className="flex justify-center gap-4">
            {[10,20,30].map((num) => (
                <button
                key={num}
                onClick={() => {
                    setMode("count");
                    setValue(num);
                }}
                className={`px-4 py-2 rounded-lg ${
                    mode === "count" && value === num
                    ? "bg-white text-black transition-all duration-150 shadow-[0_0_12px_white]"
                    : "bg-black"
                }`}
                >
                {num}問
                </button>
            ))}
            </div>
        </div>

        {/* 秒数 */}
        <div className="border-2 border-white rounded-2xl p-6 mb-8 w-80 text-center hover:shadow-[0_0_10px_white] transition">
            <h2 className="mb-4 font-semibold text-white">⏱ 秒数アタック</h2>
            <div className="flex justify-center gap-4">
            {[10,30,60].map((sec) => (
                <button
                key={sec}
                onClick={() => {
                    setMode("time");
                    setValue(sec);
                }}
                className={`px-4 py-2 rounded-lg ${
                    mode === "time" && value === sec
                    ? "bg-white text-black transition-all duration-150 shadow-[0_0_12px_white]"
                    : "bg-black"
                }`}
                >
                {sec}秒
                </button>
            ))}
            </div>
        </div>

        <button
            onClick={handleStart}
            disabled={!mode}
            className="
            px-8 py-3
            bg-black text-white
            rounded-xl
            mt-3 text-lg tracking-widest
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
            ▶ 開始する
        </button>
</div>
    </main>
  );
}