import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";

export async function isAdmin() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL;

  if (!user || user.email !== SUPERADMIN_EMAIL) {
    return notFound();
  }
}
