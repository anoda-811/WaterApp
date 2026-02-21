"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function WaterPage() {
    const [amount, setAmount] = useState(0);
    const [goal, setGoal] = useState(2000);
    const [goalInput, setGoalInput] = useState("2000");
    const percentage = goal > 0 ? (amount / goal) * 100 : 0;

    // 初回読み込み
    useEffect(() => {
    const savedAmount = localStorage.getItem("water-amount");
    const savedGoal = localStorage.getItem("water-goal");
    if (savedAmount !== null) {
        setAmount(Number(savedAmount));
    }
    if (savedGoal !== null) {
        const goalNumber = Number(savedGoal);
        setGoal(goalNumber);
        setGoalInput(savedGoal);
    }
    }, []);

    // amount更新
    useEffect(() => {
    localStorage.setItem("water-amount", String(amount));
    }, [amount]);

    // goal更新
    useEffect(() => {
    localStorage.setItem("water-goal", String(goal));
    }, [goal]);


    return (
        <main className="flex min-h-[100svh] flex-col bg-blue-50 px-4">
            {/* ヘッダー */}
            <div className="flex items-center py-4">
                <Link
                href="/"
                className="rounded-full bg-blue-500 text-white px-4 py-2 text-sm shadow-md"
                >
                ← Home
                </Link>
            </div>

            {/* 中央コンテンツ全部まとめる */}
            <div className="flex flex-1 flex-col items-center justify-center gap-6">

                {/* タイトル＋水量 */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-blue-600">
                    💧 Water Tracker
                    </h1>

                    <p className="text-lg text-blue-600 font-semibold">
                    現在の水量: {amount} / {goal} ml
                    </p>
                </div>

                {/* コンテンツ */}
                <div className="flex flex-col items-center justify-center gap-6">
                    {/* ボトル全体 */}
                    <div className="relative flex flex-col items-center">
                        {/* キャップ */}
                        <div className="relative z-10 mb-[-12px] h-8 w-16 rounded-md bg-blue-400" />
                        {/* ボトル */}
                        <div className="relative h-96 w-40 rounded-3xl border-4 border-blue-400 bg-white shadow-lg overflow-hidden">
                            {/* 水 */}
                            <div className="absolute bottom-0 w-full transition-all duration-500 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300" style={{ height: `${percentage}%` }}>
                                {/* ハイライト */}
                                <div className="absolute top-2 left-1/2 h-2 w-2/3 -translate-x-1/2 rounded-full bg-white/40 blur-sm" />
                            </div>
                        </div>
                    </div>

                    {/* 目標量 */}
                    <div className="flex items-center gap-2">
                        <span className="text-m text-blue-600">目標量:</span>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={goalInput}
                                onChange={(e) => setGoalInput(e.target.value)}
                                className="w-24 rounded border px-2 py-1 text-center text-blue-600"
                            />
                            <span className="text-sm text-blue-600">ml</span>
                        </div>
                        <button
                            onClick={() => {
                            const newGoal = Number(goalInput);
                            if (newGoal > 0) {
                                setGoal(newGoal);
                                setAmount((prev) => Math.min(prev, newGoal));
                            }
                            }}
                            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-red-600"
                        >
                            設定
                        </button>
                    </div>

                    {/* ボタン */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => setAmount(Math.max(amount - 500, 0))}
                            className="rounded-lg bg-red-400 px-4 py-2 text-white hover:bg-red-600 transition"
                        >
                            -500ml
                        </button>
                        <button
                            onClick={() => setAmount(Math.max(amount - 100, 0))}
                            className="rounded-lg bg-red-400 px-4 py-2 text-white hover:bg-red-500 transition"
                        >
                            -100ml
                        </button>
                        <button
                            onClick={() => setAmount(Math.min(amount + 100, goal))}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition"
                        >
                            +100ml
                        </button>

                        <button
                            onClick={() => setAmount(Math.min(amount + 500, goal))}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition"
                        >
                            +500ml
                        </button>

                        <button
                            onClick={() => setAmount(0)}
                            className="rounded-lg bg-gray-400 px-4 py-2 text-white hover:bg-gray-500 transition"
                        >
                            リセット
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}
