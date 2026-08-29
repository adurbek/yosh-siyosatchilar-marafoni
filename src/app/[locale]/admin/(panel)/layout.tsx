import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  seedFaqIfEmpty,
  seedAboutMenuIfEmpty,
  seedPageContentIfEmpty,
} from "@/lib/admin-seed";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  await seedFaqIfEmpty();
  await seedAboutMenuIfEmpty();
  await seedPageContentIfEmpty();

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-8">{children}</main>
    </div>
  );
}
