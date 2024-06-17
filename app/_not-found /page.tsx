"use client";
import { useRouter } from "next/navigation";

const NoFound = () => {
  const router = useRouter();
  router.push("/en/not-found");
  return (
    <div>
      <h1>404 - Page Not Found</h1>
    </div>
  );
};

export default NoFound;
