"use server";

import { db } from "@/lib/db";
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
    let product;

    product = await db.product.findFirst({ where: { imageUrl } });

    if (!product) {
      product = await db.product.create({
        data: { color, type, size, imageUrl },
      });
    }

    return product.id;
  } catch (error: any) {
    // throw new Error(error.message);
    return null;
  }
};
