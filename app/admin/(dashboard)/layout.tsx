import { createClient } from "@/lib/supabase/server";
import Sidebar from "./sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col md:flex-row" style={{ background: "var(--creme)" }}>
      <Sidebar email={user?.email ?? ""} />
      <main className="min-w-0 flex-1 px-4 pb-28 pt-5 md:px-10 md:py-8">{children}</main>
    </div>
  );
}
