import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b14] font-mono">
      <div className="text-center">
        <div className="text-[9px] tracking-[3px] text-[#F97316] mb-2">TRACKING APP</div>
        <h1 className="text-2xl font-black text-white mb-6">Chào mừng</h1>
        <Link
          href="/habits"
          className="inline-block rounded-xl bg-gradient-to-r from-[#ea580c] to-[#F97316] px-8 py-4 text-sm font-black text-white tracking-wide no-underline"
        >
          MỞ APP QUẢN LÝ THÓI QUEN →
        </Link>
        <p className="mt-4 text-[11px] text-[#444]">Theo dõi thói quen, tích lũy quỹ, nhận thưởng.</p>
      </div>
    </div>
  );
}
