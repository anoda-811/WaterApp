import Link from "next/link";

const name = "Home"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">🏠 {name}</h1>

      <Link href="/water" className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600 transition">
        💧 Water Tracker
      </Link>
    </main>
  );
}
