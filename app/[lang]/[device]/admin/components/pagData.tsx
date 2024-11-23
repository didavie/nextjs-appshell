"use client";

import useAppRouter from "@/hooks/useAppRouter";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { Dictionary } from "get-dictionary";
import { Locale } from "i18n-config";
import {
  doc,
  getDocs,
  collection,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  useAuth,
  useFirestore,
  useFirestoreCollectionData,
  useSigninCheck,
} from "reactfire";
import { use, useEffect, useState } from "react";
import { User } from "@/types/interfaces";
import { UserCollectionRef, UiCollectionRef, UiDocRef } from "@/models/models";
import { ComboboxItem, ScrollArea, Table } from "@mantine/core";
import { FontSizeMD, FontSizeSM, MaxDesktopWidth } from "@/config/styling";
import { ParsedToken, sendPasswordResetEmail } from "firebase/auth";
import AhiLoading from "@/components/loading";
import { Popover } from "@mantine/core";
import { Select, Input } from "@chakra-ui/react";
import { userApi } from "@/components/api/v1/user";
import { useAppDispatch } from "hooks/useAppDispatch";
import { defaultColor } from "config/colors";
import { UserRoles } from "types/interfaces";
import { adminApi } from "@/components/api/v1/admin";

export default function PageData({
  params: { lang, dictionary, device },
}: {
  params: { lang: Locale; dictionary: Dictionary; device: string };
}) {
  const router = useAppRouter();
  const firestore = useFirestore();
  const usersRef = collection(firestore, UserCollectionRef);
  const { status, data: signinCheckResult } = useSigninCheck();
  const auth = useAuth();
  const [claims, setClaims] = useState<ParsedToken | null>(null);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<UserRoles | undefined>("user");
  const [loading, setLoading] = useState(false);

  // const [error, setError] = useState("");
  useEffect(() => {
    if (status == "success" && !signinCheckResult?.signedIn) {
      router.push(`/${lang}/user/login`);
    }
  }, [signinCheckResult]);

  useEffect(() => {
    const Func = async () => {
      if (status !== "success") {
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
          status === "success"
        ) {
          router.push(`/${lang}/`);
        }
      }
    };
    Func();
  }, [status]);

  const handleUpdateRole = async () => {
    setLoading(true);
    if (!userId || !role) {
      return;
    }
    try {
      const res = await dispatch(
        adminApi.endpoints.setRole.initiate({ id: userId, role })
      );
      if (res.error) {
        toast({
          title: "Error",
          description: "Error updating user role",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      if (res.data) {
        toast({
          title: "Success",
          description: "User role updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      setLoading(false);
      // setError("");
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (status !== "success" || !signinCheckResult?.signedIn) {
      return;
    }
    const Func = async () => {
      const result = await auth.currentUser?.getIdTokenResult();
      if (result) {
        setClaims(result?.claims);
      }
    };
    Func();
  }, [status, signinCheckResult]);

  // if suer not signed in
  useEffect(() => {
    if (status === "success" && !signinCheckResult?.signedIn) {
      router.push(`/${lang}/${device}/user/login`);
    }
  }, [status, signinCheckResult]);

  useEffect(() => {
    if (!claims || status !== "success") return;
    const Func = async () => {
      if (!claims?.roles?.includes("admin")) {
        router.push(`/${lang}/${device}`);
      }
    };
    Func();
  }, [claims]);

  // merge with adminApi the snapshot of users

  if (status === "loading" || !signinCheckResult?.signedIn) {
    return <AhiLoading />;
  }

  return (
    <Box
      borderRadius="md"
      mx="auto"
      display="flex"
      alignItems="start"
      justifyContent="center"
      width="100%"
      flexWrap="wrap"
      pt={4}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        width="100%"
      >
        <Text fontSize={FontSizeMD} fontWeight="bold" mb={4}>
          Update User Role
        </Text>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          maxWidth="400px"
        >
          <Input
            placeholder={"user id/ Email"}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            mb={4}
          />
          <Select
            placeholder={"role"}
            value={role}
            onChange={(e) => setRole(e.target.value as UserRoles)}
            mb={4}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="dev">Dev</option>
            <option value="poster">Poster</option>
          </Select>
          <Button
            backgroundColor={defaultColor}
            onClick={handleUpdateRole}
            isLoading={loading}
            color="white"
            isDisabled={
              userId === "" || role === undefined || userId === undefined
            }
          >
            Set
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
