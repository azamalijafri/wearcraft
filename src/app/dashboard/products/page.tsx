import ProductCard from "@/components/products/ProductCard";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { ShopProduct, User } from "@prisma/client";
import Link from "next/link";

const Page = async () => {
  const products = await db.shopProduct.findMany({
    where: { byWearCraft: true },
    include: { user: true },
  });

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-4 sm:py-4 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Our Products
          </h1>
          <Link
            href={"/customize/upload?onlycreate=true&bywearcraft=true"}
            className={buttonVariants()}
          >
            Create Product
          </Link>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {products.map((product: ShopProduct & { user: User }) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
