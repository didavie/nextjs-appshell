"use client";
import { useRouter } from "next/router";
const NoFound = () => {
  const router = useRouter();

  router.push("/404");
  return null;
  // return (
  //   <div>
  //     <h1>404 - Page Not Found</h1>
  //   </div>
  // );
};



export default NoFound;
