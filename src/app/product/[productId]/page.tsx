import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductDetails from "@/components/ProductDetails";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: { productId: string } }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const product = await db.shopProduct.findFirst({
    where: { id: params.productId },
  });

  if (!product) return notFound();

  return (
    <MaxWidthWrapper>
      <ProductDetails productId={params.productId} user={user} />
    </MaxWidthWrapper>
  );
};

export default page;
