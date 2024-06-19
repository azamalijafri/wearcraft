"use server";

import {
  BASE_PRICE,
  PRODUCT_COLORS,
  PRODUCT_SIZE,
  PRODUCT_TYPE,
} from "@/constants/product-options";
import { PAGE_LIMIT } from "@/constants/variables";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";
import { NextResponse } from "next/server";

export const createCheckoutSession = async ({
  productId,
}: {
  productId: string;
}) => {
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

  const stripeProduct = await stripe.products.create({
    name: `Custom ${productType.label} (${productColor?.label})`,
    images: [product.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: totalPrice,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/customize/preview`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["IN", "US"] },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: stripeProduct.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession.url };
};

export const getLoggedInUserOrders = async ({
  currentPage,
  isDashboard,
}: {
  currentPage: number;
  isDashboard?: boolean;
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Invalid user data");
  }

  const skip = (currentPage - 1) * PAGE_LIMIT;
  const take = PAGE_LIMIT;

  let whereClause: { isPaid: boolean; userId: undefined | string } = {
    isPaid: true,
    userId: undefined,
  };

  if (!isDashboard) whereClause.userId = user?.id;

  try {
    const [orders, total] = await Promise.all([
      db.order.findMany({
        where: whereClause,
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
        where: whereClause,
      }),
    ]);

    return { data: { orders, total } };
  } catch (error) {
    console.log(error);

    return { data: { orders: [], total: 0 } };
  }
};
