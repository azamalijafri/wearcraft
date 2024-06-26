import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductDetails from "@/components/ProductDetails";

const page = ({ params }: { params: { productId: string } }) => {
  return (
    <MaxWidthWrapper>
      <ProductDetails productId={params.productId} />
    </MaxWidthWrapper>
  );
};

export default page;
