import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardRootPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?from=/dashboard");
  }

  if (user.sellerId) {
    redirect("/dashboard/seller");
  }

  redirect("/dashboard/consumer");
}
