"use client";
import {useState, FormEvent} from "react";
import {createSupabaseBrowserClient} from "@/lib/supabase/client";
import {useI18n} from "@/lib/i18n/I18nProvider";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"sent"|"error">("idle");
  const [error, setError] = useState<string>("");
  const {locale} = useI18n();
  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      if (!hasSupabaseEnv) {
        setError("当前未配置邮箱登录环境变量，请使用一键体验或配置后重试。");
        setStatus("error");
        return;
      }
      const supabase = createSupabaseBrowserClient();
      const base = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const redirectTo = `${base}/api/auth/callback?l=${encodeURIComponent(locale)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: mode === "register",
        },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (err: any) {
      setError(err?.message || "发送失败，请稍后重试");
      setStatus("error");
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{mode === "login" ? "登录" : "注册"}</h1>
        <button className="text-sm underline" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "没有账号？注册" : "已有账号？登录"}
        </button>
      </div>

      <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
        <label className="text-sm">邮箱</label>
        <input
          type="email"
          required
          className="w-full rounded border px-3 py-2 bg-transparent"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={status === "loading" || !hasSupabaseEnv}
          className="mt-2 rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-500 disabled:opacity-60"
        >
          {status === "loading" ? "发送中..." : mode === "login" ? "发送登录链接" : "创建账号"}
        </button>
      </form>

      {status === "sent" && (
        <p className="text-sm text-green-600 mt-3">链接已发送至邮箱，请查收并完成{mode === "login" ? "登录" : "注册"}。</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 mt-3">{error}</p>
      )}

      <p className="text-xs text-gray-500 mt-3">
        邮箱 Magic Link {hasSupabaseEnv ? "已启用。" : "未启用（缺少环境变量）。"}请配置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY。
      </p>

      <div className="mt-6">
        <a
          className="text-sm underline"
          href={`/api/demo-login?l=${encodeURIComponent(locale)}`}
        >
          一键体验（无需邮箱，仅预览界面）
        </a>
      </div>
    </main>
  );
}


