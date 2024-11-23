//  costume useRouter hook
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";
import { MaxMobileWidth } from "@/config/styling";
import { isMobile } from "react-device-detect";
import { useAppSelector } from "./useAppSelector";
import { useState, useEffect } from "react";

const useAppRouter = () => {
  const router = useRouter();
  const isMobileAtBreak = useMediaQuery(`${MaxMobileWidth}px`);
  const isMobileDevice = isMobile;
  // get ful url

  //   define a new class for the router with push method to be used in the app
  class AppRouter {
    push = (url: string) => {
      const urlL = window.location.href;
      const urlSplit = urlL.split("/").slice(2);
      const company = urlSplit[0].split(".")[0] || "ahi";
      let options = `?ssr=${company}`;
      if (url.includes("?")) {
        options = `&ssr=${company}`;
      }
      // if url already has ssr set it to empty
      if (url.includes("ssr")) {
        options = "";
      }
      if (isMobileDevice || isMobileAtBreak) {
        if (url.includes("/desktop")) {
          //   replace /desktop with mobile without split
          const newPath = url.replace("/desktop", "/mobile");
          router.push(newPath);
        } else if (!url.includes("/mobile")) {
          const pathInList = url.split("/");
          if (pathInList.length >= 2) {
            // put mobile in the second position
            pathInList.splice(2, 0, "mobile");
            const newPath = pathInList.join("/");
            router.push(newPath);
          } else {
            // put mobile at first position
            router.push(`/mobile${url}`);
          }
        } else {
          router.push(url);
        }
      } else {
        if (url.includes("/mobile")) {
          //   replace /mobile with desktop without split
          const newPath = url.replace("/mobile", "/desktop");
          router.push(newPath);
        } else if (!url.includes("/desktop")) {
          const pathInList = url.split("/");
          if (pathInList.length >= 2) {
            // put desktop in the second position
            pathInList.splice(2, 0, "desktop");
            const newPath = pathInList.join("/");
            router.push(newPath);
          } else {
            // put desktop at first position
            router.push(`/desktop${url}`);
          }
        } else {
          router.push(url);
        }
      }
    };
  }

  return new AppRouter();
};

const useAppRouterHook = (url: string) => {
  const router = useRouter();
  const isMobileAtBreak = useMediaQuery(`${MaxMobileWidth}px`);
  const isMobileDevice = isMobile;

  // get ful url

  useEffect(() => {
    if (isMobileDevice || isMobileAtBreak) {
      if (url.includes("/desktop")) {
        //   replace /desktop with mobile without split
        const newPath = url.replace("/desktop", "/mobile");
        router.push(newPath);
      } else if (!url.includes("/mobile")) {
        const pathInList = url.split("/");
        if (pathInList.length >= 2) {
          // put mobile in the second position
          pathInList.splice(2, 0, "mobile");
          const newPath = pathInList.join("/");
          router.push(newPath);
        } else {
          // put mobile at first position
          router.push(`/mobile${url}`);
        }
      } else {
        router.push(url);
      }
    } else {
      if (url.includes("/mobile")) {
        //   replace /mobile with desktop without split
        const newPath = url.replace("/mobile", "/desktop");
        router.push(newPath);
      } else if (!url.includes("/desktop")) {
        const pathInList = url.split("/");
        if (pathInList.length >= 2) {
          // put desktop in the second position
          pathInList.splice(2, 0, "desktop");
          const newPath = pathInList.join("/");
          router.push(newPath);
        } else {
          // put desktop at first position
          router.push(`/desktop${url}`);
        }
      } else {
        router.push(url);
      }
    }
  }, [isMobileDevice, isMobileAtBreak]);
  return null;
};

export { useAppRouter, useAppRouterHook };
export default useAppRouter;
