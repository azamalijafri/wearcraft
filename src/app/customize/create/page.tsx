"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Page = () => {
  const onlycreate = useSearchParams().get("onlycreate") == "true";
  const router = useRouter();

  if (!onlycreate) router.push("/customize/preview");

  return <div></div>;
};

export default Page;
