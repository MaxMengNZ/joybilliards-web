import {createSupabaseServerClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {MemberQR} from "@/components/profile/MemberQR";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const isDemo = (process.env.NEXT_PUBLIC_ENABLE_DEMO === "true" || process.env.NODE_ENV !== "production") && cookieStore.get("demo")?.value === "1";

  let user: { id: string; email?: string | null } | null = null;
  if (!isDemo) {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (!user) {
      redirect(`/${locale}/auth/login`);
    }
  }

  async function signOutAction() {
    "use server";
    const s = createSupabaseServerClient();
    await s.auth.signOut();
    redirect(`/${locale}`);
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">我的</h1>
      <div className="mt-4 grid gap-2 text-sm">
        <div><span className="text-gray-500">用户ID：</span>{user?.id ?? "demo-user"}</div>
        <div><span className="text-gray-500">邮箱：</span>{user?.email ?? "demo@example.com"}</div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-medium mb-3">数字会员卡</h2>
        <MemberQR payload={`joybilliards://member/${user?.id ?? "demo-user"}`} />
      </section>

      <section className="mt-8 grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium">我的订单</h3>
          <p className="text-sm text-gray-500 mt-1">暂无数据</p>
        </div>
        <div>
          <h3 className="font-medium">我的报名</h3>
          <p className="text-sm text-gray-500 mt-1">暂无数据</p>
        </div>
        <div>
          <h3 className="font-medium">我的预约</h3>
          <p className="text-sm text-gray-500 mt-1">暂无数据</p>
        </div>
      </section>
      <form action={signOutAction} className="mt-6">
        <button type="submit" className="rounded bg-red-600 text-white px-4 py-2 hover:bg-red-500">退出登录</button>
      </form>
    </main>
  );
}


