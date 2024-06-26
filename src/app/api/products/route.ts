import { getAllProducts } from "@/actions/product-actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const pageParam = parseInt(searchParams.get("page")!) ?? 0;
  const colors = searchParams.get("colors")?.split(",") || [];
  const types = searchParams.get("types")?.split(",") || [];
  const searchQuery = searchParams.get("search") || "";

  try {
    const { products, nextPage } = await getAllProducts({
      pageParam,
      colors,
      types,
      searchQuery,
    });
    return NextResponse.json({ products, nextPage });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
