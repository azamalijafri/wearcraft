import { getWearCraftProducts } from "@/actions/product-actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const pageParam = parseInt(searchParams.get("page")!);

  try {
    const { products, nextPage } = await getWearCraftProducts({ pageParam });
    return NextResponse.json({ products, nextPage });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
