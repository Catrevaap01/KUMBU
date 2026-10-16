import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { getUsersForAdmin } from "@/lib/admin/getUsersForAdmin";
import { AdminNav } from "@/components/admin/AdminNav";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

export const metadata: Metadata = {
  title: "Gestão de Utilizadores — Administração KUBIKA",
  description: "Lista e administração de utilizadores, comerciantes e administradores da plataforma KUBIKA.",
};

import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminUsersPage() {
  const admin = await requireAdmin("/admin/users");
  const users = await getUsersForAdmin();

  return (
    <main className="container-page flex flex-col gap-6 py-10">
      <AdminHeader />

      <AdminNav active="/admin/users" />

      <UserManagementTable users={users} currentAdminId={admin.id} />
    </main>
  );
}
