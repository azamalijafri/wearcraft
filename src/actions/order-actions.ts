"use server";

import {
  BASE_PRICE,
  PRODUCT_COLORS,
  PRODUCT_SIZE,
  PRODUCT_TYPE,
} from "@/constants/product-options";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

export const createOrder = async ({ productId }: { productId: string }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      productId,
    },
  });

  const product = await db.product.findFirst({ where: { id: productId } });

  if (!product) throw new Error("Product not found");

  const productColor = PRODUCT_COLORS.find(
    (supportedColor) => supportedColor.value === product.color
  );

  const productType = PRODUCT_TYPE.find(({ value }) => value === product.type)!;

  const productSize = PRODUCT_SIZE.find(({ value }) => value === product.size);

  let totalPrice = BASE_PRICE + productType?.price;

  let order: Order;

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: totalPrice / 100,
        userId: user.id,
        productId,
      },
    });
  }
};
