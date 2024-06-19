import { PAGE_LIMIT } from "@/constants/variables";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const currentPage = parseInt(searchParams.get("currentPage")!);

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email) {
    throw new Error("Invalid user data");
  }

  const skip = (currentPage - 1) * PAGE_LIMIT;
  const take = PAGE_LIMIT;

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where: {
        userId: user.id,
        isPaid: true,
      },
      include: {
        billingAddress: true,
        product: true,
        shippingAddress: true,
        user: true,
      },
      skip,
      take,
    }),
    db.order.count({
      where: {
        userId: user.id,
        isPaid: true,
      },
    }),
  ]);

  throw new Error("error");

  return NextResponse.json({ orders, total }, { status: 200 });
}
