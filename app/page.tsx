import Link from "next/link";

const name = "Home"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">🏠 {name}</h1>

      <Link href="/water" className="            px-8 py-3
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
            active:text-black">
        💧 Water Tracker
      </Link>

      <Link href="/nine" className="
            px-8 py-3
            bg-black text-white
            rounded-xl
            mt-4 text-lg tracking-widest
            transition
            hover:shadow-[0_0_12px_white]
            hover:bg-white
            hover:text-black
            transition-all duration-200
            active:shadow-[0_0_20px_white]
            active:bg-white
            active:text-black">
        🏠 九九道場
      </Link>

      
      <Link href="/battle" className="
            px-8 py-3
            bg-black text-white
            rounded-xl
            mt-4 text-lg tracking-widest
            transition
            hover:shadow-[0_0_12px_white]
            hover:bg-white
            hover:text-black
            transition-all duration-200
            active:shadow-[0_0_20px_white]
            active:bg-white
        ⚔ck">
        ⚔ バトル
      </Link>
    </main>
  );
}
