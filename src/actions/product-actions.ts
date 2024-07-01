"use server";

import { PAGE_LIMIT, PRODUCTS_LIMIT } from "@/constants/variables";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ProductColor, ProductSize, ProductType } from "@prisma/client";

interface CreateCheckoutProductProps {
  imageUrl: string;
  size: ProductSize;
  color: ProductColor;
  type: ProductType;
}

export const createCheckoutProduct = async ({
  imageUrl,
  size,
  color,
  type,
}: CreateCheckoutProductProps) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) throw new Error("unauthorized access");

    let product;
    product = await db.checkoutProduct.findFirst({
      where: { imageUrl, size },
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

interface CreateShopProductProps {
  byWearCraft: boolean;
  imageUrl: string;
  color: ProductColor;
  type: ProductType;
  title: string;
}

export const createShopProduct = async ({
  title,
  imageUrl,
  color,
  type,
  byWearCraft = false,
}: CreateShopProductProps) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) throw new Error("unauthorized access");

    const userFromDb = await db.user.findFirst({ where: { id: user?.id } });

    if (!userFromDb) throw new Error("unauthorized access");

    if (byWearCraft && !userFromDb.isAdmin)
      throw new Error("unauthorized access");

    let product;
    product = await db.shopProduct.findFirst({
      where: { imageUrl },
    });

    if (!product) {
      product = await db.shopProduct.create({
        data: {
          color,
          type,
          imageUrl,
          userId: user.id,
          byWearCraft,
          title,
          isPublished: byWearCraft ? true : false,
        },
      });
    }

    return product.id;
  } catch (error: any) {
    // throw new Error(error.message);
    throw new Error(error.message);
  }
};

export const getWearCraftProducts = async ({
  pageParam = 0,
}: {
  pageParam: number;
}) => {
  const products = await db.shopProduct.findMany({
    where: {
      byWearCraft: true,
    },
    include: {
      user: true,
      ratings: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: pageParam * PRODUCTS_LIMIT,
    take: PRODUCTS_LIMIT,
  });

  const totalProducts = await db.shopProduct.count({
    where: { byWearCraft: true },
  });

  const nextPage =
    (pageParam + 1) * PRODUCTS_LIMIT < totalProducts ? pageParam + 1 : null;

  return { products, nextPage };
};

export const getAllProducts = async ({
  pageParam = 0,
  colors,
  types,
  searchQuery,
}: {
  pageParam: number;
  colors: string[];
  types: string[];
  searchQuery: string;
}) => {
  const filters: any = {};

  if (colors.length > 0) {
    filters.color = { in: colors };
  }

  if (types.length > 0) {
    filters.type = { in: types };
  }

  if (searchQuery) {
    filters.title = { contains: searchQuery, mode: "insensitive" };
  }

  const products = await db.shopProduct.findMany({
    where: filters,
    include: {
      user: true,
      ratings: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: pageParam * PRODUCTS_LIMIT,
    take: PRODUCTS_LIMIT,
  });

  const totalProducts = await db.shopProduct.count({
    where: filters,
  });

  const nextPage =
    (pageParam + 1) * PRODUCTS_LIMIT < totalProducts ? pageParam + 1 : null;

  return { products, nextPage };
};
