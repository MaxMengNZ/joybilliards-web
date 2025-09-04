import {Benefits} from "@/components/home/Benefits";
import {Pricing} from "@/components/membership/Pricing";

export default function MembershipPage() {
  return (
    <main className="mx-auto max-w-[1000px] px-6 sm:px-8 py-16">
      <h1 className="text-3xl font-semibold text-center">Membership</h1>
      <p className="text-sm text-gray-500 text-center mt-2">Tiers, pricing and benefits</p>
      <div className="mt-8" />
      <Benefits />
      <Pricing />
    </main>
  );
}


