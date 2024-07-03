import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const productId = searchParams.get("productId");

  try {
    if (!productId) throw new Error("invalid product id");

    const product = await db.shopProduct.findUnique({
      where: { id: productId, isPublished: true },
      include: { user: true },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
