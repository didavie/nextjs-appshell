// "use client";
"use client";
import { Locale } from "i18n-config";
import { Box } from "@chakra-ui/react";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { UserRoles } from "types/interfaces";
import useAppRouter from "@/hooks/useAppRouter";
import { useAuth, useSigninCheck } from "reactfire";
import { adminApi } from "@/components/api/v1/admin";
export default function Page({
  params: { lang, device },
}: {
  params: { lang: Locale; device: string };
}) {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<UserRoles>("user");
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const { status: st, data: signinCheckResult } = useSigninCheck();
  const router = useAppRouter();
  const auth = useAuth();
  const [claims, setClaims] = useState<any>();

  useEffect(() => {
    if (st == "success" && !signinCheckResult?.signedIn) {
      router.push(`/${lang}/user/login`);
    }
  }, [signinCheckResult]);

  useEffect(() => {
    const Func = async () => {
      if (st !== "success") {
        return;
      }
      if (!signinCheckResult?.signedIn) {
        router.push(`/${lang}/user/login`);
      }
      const result = await auth.currentUser?.getIdTokenResult();
      if (result) {
        setClaims(result?.claims);
        if (
          !result?.claims?.roles?.includes("admin") &&
          !result?.claims?.roles?.includes("superAdmin") &&
          st === "success"
        ) {
          router.push(`/${lang}/`);
        }
      }
    };
    Func();
  }, [st]);

  return (
    <Box
      display="flex"
      height="100vh"
      width="80vw"
      mt={10}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {/* <Box>{error}</Box> */}
    </Box>
  );
}
