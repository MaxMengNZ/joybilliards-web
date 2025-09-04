"use client";
import {Link} from "@/i18n/routing";

const tiers = [
  { id: "basic", name: "Basic", price: "$49 / year", features: ["Member pricing", "Digital card" ] },
  { id: "plus", name: "Plus", price: "$89 / year", features: ["All Basic", "Priority booking", "Ranking points" ] },
  { id: "pro", name: "Pro", price: "$129 / year", features: ["All Plus", "Event discounts", "Early access"] },
];

export function Pricing() {
  return (
    <section className="mx-auto max-w-[1000px] px-6 sm:px-8 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map(t => (
          <div key={t.id} className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur p-6">
            <div className="text-lg font-semibold tracking-tight">{t.name}</div>
            <div className="text-2xl mt-2">{t.price}</div>
            <ul className="text-sm text-gray-500 mt-3 space-y-1">
              {t.features.map((f, i) => (<li key={i}>{f}</li>))}
            </ul>
            <Link href={{pathname: "/auth/login"}} className="inline-block mt-5 rounded px-4 py-2 bg-blue-600 text-white hover:bg-blue-500">Join</Link>
          </div>
        ))}
      </div>
    </section>
  );
}


