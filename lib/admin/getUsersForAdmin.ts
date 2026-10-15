import { prisma } from "@/lib/db/client";

export type AdminUserItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  systemRole: "USER" | "ADMIN";
  createdAt: Date;
  submittedReportsCount: number;
  confirmationsCount: number;
  seller: {
    id: string;
    businessName: string;
    sellerType: string;
    city: string | null;
    verificationStatus: string;
  } | null;
};

export async function getUsersForAdmin(): Promise<AdminUserItem[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      systemRole: true,
      createdAt: true,
      seller: {
        select: {
          id: true,
          businessName: true,
          sellerType: true,
          city: true,
          verificationStatus: true,
        },
      },
      _count: {
        select: {
          submittedReports: true,
          confirmations: true,
        },
      },
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    systemRole: u.systemRole,
    createdAt: u.createdAt,
    submittedReportsCount: u._count.submittedReports,
    confirmationsCount: u._count.confirmations,
    seller: u.seller,
  }));
}
