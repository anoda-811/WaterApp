"use client"
import { useEffect, useRef, useState } from "react"

export default function Battle() {
    const [playerHp, setPlayerHp] = useState(100)
    const [enemyHp, setEnemyHp] = useState(80)
    const [message, setMessage] = useState("敵があらわれた！")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [pixels, setPixels] = useState<string[][]>([])
    const maxPlayerHp = 100
    const maxEnemyHp = 80
    const [phase, setPhase] = useState<
    "intro" | "start" | "player" | "enemy" | "message" | "win" | "lose"
    >("intro")
    const [selected, setSelected] = useState(0)
    const commands = ["たたかう", "スキル", "ぼうぎょ"]
    const playSound = (src: string) => {
        const audio = new Audio(src)
        audio.volume = 0.6
        audio.play()
    }

    // 自分の攻撃
    const attack = () => {
        if (phase !== "player") return

        playSound("/sounds/氷魔法1.mp3")
        const damage = Math.floor(Math.random() * 10) + 5
        const newEnemyHp = Math.max(enemyHp - damage, 0)

        setEnemyHp(newEnemyHp)
        setMessage(`敵に ${damage} ダメージ！`)
        setPhase("message")

        if (newEnemyHp <= 0) {
        setMessage("魔王をたおした！")
        setPhase("win")
        return
        }

        setTimeout(() => {
            setPhase("enemy")
        }, 1200)
    }

    // 敵の攻撃
    useEffect(() => {
    if (phase === "enemy") {
        const damage = Math.floor(Math.random() * 10) + 25
        const newPlayerHp = Math.max(playerHp - damage, 0)

        setTimeout(() => {
        setPlayerHp(newPlayerHp)
        setMessage(`敵のこうげき！ ${damage} ダメージ！`)
        setPhase("message")

        if (newPlayerHp <= 0) {
            setPhase("lose")
            setMessage("やられてしまった…")
        } else {
            setTimeout(() => {
            setPhase("player")
            }, 1200)
        }
        }, 800)
    }
    }, [phase])

    // 画像処理
    useEffect(() => {
        const img = new Image()
        img.src = "/demon1.png"
        img.onload = () => {
            const canvas = canvasRef.current!
            const ctx = canvas.getContext("2d")!

            const size = 64
            canvas.width = size
            canvas.height = size

            ctx.drawImage(img, 0, 0, size, size)

            const imageData = ctx.getImageData(0, 0, size, size)
            const data = imageData.data

            const pixelArray: string[][] = []

            for (let y = 0; y < size; y++) {
                const row: string[] = []
                for (let x = 0; x < size; x++) {
                    const i = (y * size + x) * 4
                    const r = data[i]
                    const g = data[i + 1]
                    const b = data[i + 2]
                    const a = data[i + 3]

                    // 🔥 白に近い色を透明にする
                    if (r > 230 && g > 230 && b > 230) {
                    row.push("transparent")
                    } else {
                    row.push(`rgba(${r},${g},${b},${a / 255})`)
                    }
                }
                pixelArray.push(row)
            }

            setPixels(pixelArray)
        }
    }, [])

    // 敵出現
    useEffect(() => {
    if (phase === "start") {
        playSound("/sounds/怪獣の足音.mp3")

        setTimeout(() => {
        setPhase("player")
        }, 1000)
    }
    }, [phase])

    // コマンド制御
    useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.repeat) return
        setSelected((prev) => {
        if (phase !== "player") return prev

        if (e.key === "ArrowDown") {
            return (prev + 1) % commands.length
        }

        if (e.key === "ArrowUp") {
            return (prev - 1 + commands.length) % commands.length
        }

        return prev
        })

        if (e.key === "Enter") {
        if (selected === 0) attack()
        if (selected === 1) console.log("スキル")
        if (selected === 2) console.log("ぼうぎょ")
        }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
    }, [selected, phase])

    return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center gap-6 font-mono">

      {/* ボス画像 */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(64, 4.5px)",
        }}
      >
        {pixels.map((row, y) =>
          row.map((color, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: 4.5,
                height: 4.5,
                backgroundColor: color,
              }}
            />
          ))
        )}
      </div>

      <h1>魔王</h1>
      <HpBar current={enemyHp} max={maxEnemyHp} />

    <div className="border border-white p-6 w-80">
    <p className="mb-4">{message}</p>

    {phase === "intro" && (
        <button
            onClick={() => {
            playSound("/sounds/怪獣の足音.mp3")
            setPhase("start")
            }}
            className="
            border border-white px-6 py-2
            bg-black text-white
            transition
            hover:shadow-[0_0_12px_white]
            hover:bg-white
            hover:text-black
            transition-all duration-200
            active:shadow-[0_0_20px_white]
            active:bg-white
            active:text-black"
        >
            ▶ バトル開始
        </button>
    )}

    {phase === "player" && (
        <div className="flex flex-col gap-2">
        {commands.map((cmd, i) => (
            <button
            key={i}
            onClick={() => {
                if (phase !== "player") return
                setSelected(i)
                if (i === 0) attack()
            }}
            className={`
                border border-white py-2 hover:shadow-[0_0_12px_white]
                ${selected === i ? "bg-white text-black shadow-[0_0_12px_white]" : ""}
            `}
            >
            {cmd}
            </button>
        ))}
        </div>
    )}
    </div>

      <div>自分HP: {playerHp}</div>
    </div>
  )

  function HpBar({ current, max }: { current: number; max: number }) {
  const percentage = (current / max) * 100

  return (
    <div className="w-64 border border-white h-4 bg-gray-800">
      <div
        className="h-full transition-all duration-300"
        style={{
          width: `${percentage}%`,
          backgroundColor:
            percentage > 50
              ? "#22c55e"
              : percentage > 20
              ? "#eab308"
              : "#ef4444",
        }}
      />
    </div>
  )
}
}