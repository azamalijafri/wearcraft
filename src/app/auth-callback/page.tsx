"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAuthStatus } from "./actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Page = () => {
  // const [designConfig, setDesignConfig] = useState<any | null>(null);
  const [pathname, setPathname] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // const config = localStorage.getItem("designConfiguration");
    // if (config) setDesignConfig(config);
    const redirectUrl = localStorage.getItem("redirectUrl");
    if (redirectUrl) setPathname(redirectUrl);
  }, []);

  const { data } = useQuery({
    queryKey: ["auth-callback"],
    queryFn: async () => await getAuthStatus(),
    retry: true,
    retryDelay: 500,
  });

  if (data?.success) {
    if (pathname) {
      localStorage.removeItem("redirectUrl");
      router.push(pathname);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <h3 className="font-semibold text-xl">Logging you in...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
