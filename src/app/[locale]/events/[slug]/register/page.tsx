import {cookies} from "next/headers";
import Link from "next/link";
import {hasSupabaseEnv} from "@/lib/env";

export default async function EventRegisterPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const cookieStore = await cookies();
  const isDemo = (process.env.NEXT_PUBLIC_ENABLE_DEMO === "true" || process.env.NODE_ENV !== "production") && cookieStore.get("demo")?.value === "1";

  return (
    <main className="mx-auto max-w-[800px] px-6 sm:px-8 py-16">
      <h1 className="text-3xl font-semibold text-center">赛事报名</h1>
      {!isDemo && (
        <p className="text-sm text-gray-500 text-center mt-2">请先登录再报名。<Link className="underline" href={`/${locale}/auth/login`}>前往登录</Link></p>
      )}
      {isDemo && (
        <div className="mt-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur p-6">
          <p className="text-sm text-gray-500">当前为演示模式，未接入真实支付。</p>
          <form className="mt-6 grid gap-3">
            <label className="text-sm">选手姓名</label>
            <input className="rounded border px-3 py-2 bg-transparent" placeholder="您的姓名" />
            <label className="text-sm">备注</label>
            <textarea className="rounded border px-3 py-2 bg-transparent" placeholder="可选" />
            <button type="button" className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-500">提交报名（演示）</button>
          </form>
        </div>
      )}
      {!isDemo && hasSupabaseEnv() && (
        <form className="mt-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur p-6" action={(async () => {
          "use server";
        })}>
          <p className="text-sm text-gray-500">将创建报名并跳转到支付页面。</p>
          <button formAction={(async () => {
            "use server";
          })} disabled className="mt-4 rounded bg-blue-600 text-white px-4 py-2 opacity-60">前端占位（下一步接 Server Action 调用 API）</button>
        </form>
      )}
    </main>
  );
}


