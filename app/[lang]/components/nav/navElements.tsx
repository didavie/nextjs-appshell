"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconBrandWhatsapp,
  IconBuildingStore,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconLogin,
  IconLogout,
  IconShoppingBag,
  IconSquarePlus,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import { IconBrandFacebook } from "@tabler/icons-react";
import { IconBrandInstagram } from "@tabler/icons-react";
import { IconMapPin } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { Dialog, Divider, ScrollArea, useMantineTheme } from "@mantine/core";
import { usePrevious } from "@mantine/hooks";
import { useWindowScroll } from "@mantine/hooks";
import { defaultColor } from "config/colors";
import { usePathname } from "next/navigation";
import useAppRouter from "@/hooks/useAppRouter";

import dynamic from "next/dynamic";
const FcAddColumn = dynamic(
  () => import("react-icons/fc").then((icon) => icon.FcAddColumn),
  {
    ssr: false,
  }
);
const FcHome = dynamic(
  () => import("react-icons/fc").then((icon) => icon.FcHome),
  {
    ssr: false,
  }
);
const FcRight = dynamic(
  () => import("react-icons/fc").then((icon) => icon.FcRight),
  {
    ssr: false,
  }
);

import { Avatar, Button, DrawerCloseButton, Select } from "@chakra-ui/react";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Text,
  Box,
} from "@chakra-ui/react";

import { useAuth, useFirestore, useSigninCheck } from "reactfire";
import { ParsedToken } from "firebase/auth";
import { doc, updateDoc, collection, query, setDoc } from "firebase/firestore";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/redux/store/store";
import {
  FontSizeL,
  FontSizeMD,
  FontSizeSM,
  FontSizeXL,
  FontSizeXS,
  FontSizeXXXL,
} from "@/config/styling";
import { FaBlog } from "react-icons/fa6";

const NavElementsInNav = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentPathLang, setCurrentPathLang] = useState("en");
  const [currentCurrency, setCurrentCurrency] = useState("xof");
  const router = useAppRouter();
  const paths = usePathname();
  useEffect(() => {
    const pathComponents = paths.split("/").slice(1);
    setCurrentPathLang(pathComponents[0]);
  }, [paths]);

  return (
    <Box>
      {/* {!isMobile && ( */}
      <Box
        id="navbarNav"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="https://wa.me/message/GX45TNBNXJLIF1">
          <IconBrandWhatsapp
            style={{
              marginRight: 4,
            }}
            size={20}
            color="#25D366"
          />
        </Link>
        <Link href="https://www.facebook.com/profile.php?id=100083554441026&mibextid=ZbWKwL">
          <IconBrandFacebook
            style={{
              marginRight: 4,
            }}
            size={20}
            color="#4267B2"
          />
        </Link>
        <Link href="https://instagram.com/cami_market1?igshid=OGQ5ZDc2ODk2ZA==">
          <IconBrandInstagram
            style={{
              marginRight: 4,
            }}
            size={20}
            color={"#e420fa"}
          />
        </Link>
        <Link href="https://maps.app.goo.gl/9PDBL96sUxm6FX2z5">
          <IconMapPin size={20} color={"#e420fa"} />
        </Link>
      </Box>
    </Box>
  );
};

const NavElementsOutsideNav = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [opened, setOpened] = useState(true);
  const [isScrol, setIsScrol] = useState(true);

  const [scroll, scrollTo] = useWindowScroll();
  const prevY = usePrevious(scroll.y);

  useEffect(() => {
    if (prevY !== undefined) {
      if (scroll.y > prevY) {
        setIsScrol(true);
      } else {
        setIsScrol(false);
      }
    }
  }, [scroll.y, prevY]);

  useEffect(() => {
    if (isMobile) {
      setOpened(true);
    } else {
      setOpened(false);
    }
  }, [isMobile]);
  return (
    <>
      {isMobile && (
        <Dialog
          opened={opened}
          title="CM"
          position={{ bottom: "80px" }}
          style={{
            position: "fixed",
            zIndex: 100,
            right: "10px",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            borderRadius: 10,
            boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.3)",
          }}
        >
          <Link href="https://wa.me/message/GX45TNBNXJLIF1">
            <IconBrandWhatsapp
              style={{
                marginRight: 15,
                marginLeft: 15,
              }}
              size={30}
              color="#25D366"
            />
          </Link>
          <Link href="https://www.facebook.com/profile.php?id=100083554441026&mibextid=ZbWKwL">
            <IconBrandFacebook
              style={{
                marginRight: 15,
                marginLeft: 15,
              }}
              size={30}
              color="#4267B2"
            />
          </Link>
          <Link href="https://instagram.com/cami_market1?igshid=OGQ5ZDc2ODk2ZA==">
            <IconBrandInstagram
              style={{
                marginRight: 15,
                marginTop: 15,
                marginBottom: 15,
                marginLeft: 15,
              }}
              size={30}
              color={"#e420fa"}
            />
          </Link>
          {/* <Link href="https://map.google.com/maps?q=6.387629985809326,2.3354876041412354">
            <IconMapPin
              style={{
                marginRight: 15,
                marginTop: 15,
                marginBottom: 15,
                marginLeft: 15,
              }}
              size={30}
              color={"#e420fa"}
            />
          </Link> */}
        </Dialog>
      )}
    </>
  );
};

export const MenuModal = ({
  isOpen,
  setOpen,
  lang,
  dictionary,
}: {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lang: string;
  dictionary: any;
}) => {
  const router = useAppRouter();
  const paths = usePathname();
  const theme = useMantineTheme();
  const { status, data: signInCheckResult } = useSigninCheck();
  // const currency = useAppSelector((state) => state.user.currency);
  // const [currentCurrency, setCurrentCurrency] = useState(currency);
  const [claims, setClaims] = useState<ParsedToken>({
    role: "shopper",
  });
  const firestore = useFirestore();
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const [currentPathLang, setCurrentPathLang] = useState("en");

  useEffect(() => {
    if (status !== "success" || !signInCheckResult?.signedIn) {
      return;
    }
    const Func = async () => {
      const result = await auth.currentUser?.getIdTokenResult();
      if (result) {
        setClaims(result?.claims);
      }
    };
    Func();
  }, [status]);

  useEffect(() => {
    const pathComponents = paths.split("/").slice(1);
    setCurrentPathLang(pathComponents[0]);
  }, [paths]);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={() => setOpen(false)}>
      <DrawerOverlay />
      <DrawerContent>
        {/* <DrawerCloseButton /> */}
        <DrawerHeader>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
            w={"100%"}
            m={"auto"}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              w={"100%"}
              m={"auto"}
              display={signInCheckResult?.signedIn ? "none" : "block"}
            >
              <Button
                onClick={() => {
                  setOpen(false);
                  router.push(`/${currentPathLang}/user/signup`);
                }}
                w={"100%"}
                backgroundColor={defaultColor}
                maxW={"200px"}
                display={signInCheckResult?.signedIn ? "none" : "block"}
                fontSize={FontSizeXS}
                m={2}
                mt={0}
              >
                Create Account
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  router.push(`/${currentPathLang}/user/login`);
                }}
                w={"100%"}
                backgroundColor={defaultColor}
                maxW={"200px"}
                display={signInCheckResult?.signedIn ? "none" : "block"}
                m={2}
                fontSize={FontSizeXS}
                mt={0}
              >
                Sign In
              </Button>
            </Box>

            <Box
              style={{
                display: signInCheckResult?.signedIn ? "block" : "none",
                justifyContent: "flex-start",
                alignItems: "left",
              }}
              w={"100%"}
              m={"auto"}
              borderRadius={15}
              backgroundColor={"#f0f0f0"}
              border={"aliceblue"}
              boxShadow="md"
              p={2}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                w={"100%"}
                m={"auto"}
                onClick={() => {
                  setOpen(false);
                  router.push(`/${currentPathLang}/user/account`);
                }}
              >
                <Avatar
                  src={
                    signInCheckResult?.signedIn
                      ? signInCheckResult.user.photoURL ?? ""
                      : ""
                  }
                  size={"md"}
                  display={signInCheckResult?.signedIn ? "block" : "none"}
                />
                <Box>
                  <Text
                    display={signInCheckResult?.signedIn ? "block" : "none"}
                    fontSize={FontSizeL}
                    pl={2}
                  >
                    {signInCheckResult?.signedIn
                      ? signInCheckResult.user.displayName
                      : ""}
                  </Text>
                  <Text
                    display={signInCheckResult?.signedIn ? "block" : "none"}
                    fontSize={FontSizeXS}
                    pl={2}
                  >
                    {signInCheckResult?.signedIn
                      ? signInCheckResult.user.email
                      : ""}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </DrawerHeader>
        <Divider w={"100vw"} m="auto" h={2} />

        <DrawerBody>
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "left",
            }}
            w={"100%"}
            marginBottom={5}
          >
            <Box
              style={{
                display: "flex",
              }}
              w={"100%"}
              marginBottom={5}
              onClick={() => {
                setOpen(false);
              }}
            >
              <FcHome size={30} />
              <Link href={`/${currentPathLang}`}>
                <Text
                  style={{
                    marginLeft: 10,
                    cursor: "pointer",
                  }}
                  fontSize={FontSizeXL}
                >
                  Home
                </Text>
              </Link>
            </Box>
          </Box>
          <Divider w={"100vw"} m="auto" h={2} />
          <Box
            style={{
              display: signInCheckResult?.signedIn ? "flex" : "none",
              justifyContent: "flex-start",
              alignItems: "left",
            }}
            w={"100%"}
            marginBottom={5}
            onClick={() => {
              setOpen(false);
            }}
          >
            <FcAddColumn size={30} />
            <Link href={`/${currentPathLang}/post/create`}>
              <Text
                style={{
                  marginLeft: 10,
                  cursor: "pointer",
                }}
                fontSize={FontSizeXL}
              >
                Create Post
              </Text>
            </Link>
          </Box>
          <Box
            style={{
              display: signInCheckResult?.signedIn ? "flex" : "none",
              justifyContent: "flex-start",
              alignItems: "left",
            }}
            w={"100%"}
            marginBottom={5}
            onClick={() => {
              auth.signOut();
              router.push(`/${currentPathLang}/`);
              setOpen(false);
            }}
          >
            <FcRight
              size={30}
              style={{
                borderRadius: 15,
                border: `2px solid ${defaultColor}`,
              }}
            />
            <Link href={`/${currentPathLang}`}>
              <Text
                style={{
                  marginLeft: 10,
                  cursor: "pointer",
                }}
                fontSize={FontSizeXL}
              >
                Sign Out
              </Text>
            </Link>
          </Box>
        </DrawerBody>

        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const BoxMenuElement = ({
  title,
  logo,
  setOpen,
  currentPathLang,
  rest,
}: {
  title: string;
  logo: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentPathLang: string;
  rest?: any;
}) => {
  return (
    <Box
      _hover={{
        cursor: "pointer",
      }}
      borderRadius={15}
      padding={2}
      backgroundColor={"#f0f0f0"}
      boxShadow="md"
      w={"fit-content"}
      minWidth={"70px"}
      h={"70px"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      margin={5}
      {...rest}
    >
      {logo}
      <Text fontSize={"0.6rem"} fontWeight={600}>
        {title}
      </Text>
    </Box>
  );
};
export { NavElementsInNav, NavElementsOutsideNav };
