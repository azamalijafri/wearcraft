import { getWearCraftProducts } from "@/actions/product-actions";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const pageParam = parseInt(searchParams.get("page")!) ?? 0;

  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();
    if (!kindeUser)
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });
    const user = await db.user.findFirst({ where: { id: kindeUser?.id } });

    if (!user || !user.isAdmin)
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });

    const { products, nextPage } = await getWearCraftProducts({ pageParam });
    return NextResponse.json({ products, nextPage });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
