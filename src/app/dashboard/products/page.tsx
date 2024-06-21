import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4 min-h-screen">
        <div className="flex flex-col gap-12 h-full">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Our Products</h1>
            <Link
              href={"/customize/upload?onlycreate=true"}
              className={buttonVariants()}
            >
              Create Product
            </Link>
          </div>
          <Separator />
        </div>
      </div>
    </div>
  );
};

export default Page;
