"use server";

import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ProductColor, ProductSize, ProductType } from "@prisma/client";

interface CreateProductProps {
  imageUrl: string;
  size: ProductSize;
  color: ProductColor;
  type: ProductType;
}
export const createProduct = async ({
  imageUrl,
  size,
  color,
  type,
}: CreateProductProps) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) throw new Error("unauthorized access");

    let product;
    product = await db.checkoutProduct.findFirst({
      where: { imageUrl },
    });

    if (!product) {
      product = await db.checkoutProduct.create({
        data: { color, type, size, imageUrl },
      });
    }

    return product.id;
  } catch (error: any) {
    // throw new Error(error.message);
    throw new Error(error.message);
  }
};
