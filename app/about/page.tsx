import Link from "next/link";
import CheckoutButton from "@/app/components/CheckoutButton";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
        <p className="mb-5 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium tracking-wide text-emerald-800">
          WILLOW
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          The people you love shouldn&apos;t be left with chaos.
          <br />
          <span className="text-emerald-700">They should be left with you.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
          Willow helps you prepare your digital estate while you&apos;re alive —
          then leaves behind a companion that speaks in your own voice to guide
          your family through everything that comes next.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/companion"
            className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Talk to Willow
          </Link>
          <a
            href="#how"
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            How it works
          </a>
        </div>
      </section>

      {/* Two flows */}
      <section id="how" className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-7">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              While you&apos;re alive
            </h2>
            <p className="mt-3 text-stone-700">
              In one calm conversation, Willow organizes your accounts,
              insurance, property, and wishes — then you record a short voice
              sample and write a few words about how you speak to the people you
              love.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-7">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              After you&apos;re gone
            </h2>
            <p className="mt-3 text-stone-700">
              Your family logs in and your companion activates — in your voice.
              It acknowledges their grief, then walks them through exactly which
              bank to call, which policy to claim, and what to do, step by step.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl bg-stone-900 p-8 text-center text-stone-100">
          <h3 className="text-xl font-semibold">Start with a readiness check</h3>
          <p className="mx-auto mt-2 max-w-md text-stone-300">
            See exactly where your estate is exposed — and what your family would
            face today. Full report and AI companion from $9.
          </p>
          <div className="mt-6">
            <CheckoutButton className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-500">
              Get my readiness report — $9
            </CheckoutButton>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-4xl px-6 py-10 text-center text-xs text-stone-400">
        Willow · SuperAI NEXT Hackathon 2026
      </footer>
    </main>
  );
}
