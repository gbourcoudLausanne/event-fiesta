import { createClient } from "@/lib/supabase/server";
import Sidebar from "./sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen" style={{ background: "var(--creme)" }}>
      <Sidebar email={user?.email ?? ""} />
      <main className="flex-1 overflow-y-auto px-10 py-8">{children}</main>
    </div>
  );
}
