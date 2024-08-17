"use client";
import { Breakpoints } from "@/config/ui";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setPostFilter } from "@/redux/actions/post";
import { RootState } from "@/redux/store/store";
import { Box, Text, useMediaQuery } from "@chakra-ui/react";
import { Locale } from "i18n-config";
import { usePathname } from "next/navigation";
import useAppRouter from "@/hooks/useAppRouter";

import { useSigninCheck } from "reactfire";

const Top = ({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: Locale;
}) => {
  const { status, data: signInCheckResult } = useSigninCheck();
  const [isMobile] = useMediaQuery(`(max-width: ${Breakpoints.sm}px)`);
  const { viewPostsFilter } = useAppSelector((state: RootState) => state.ui);
  const dispatch = useAppDispatch();
  const router = useAppRouter();
  const path = usePathname();

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      width="100%"
      minHeight="100vh"
      pt={4}
    >
      <Box
        display={isMobile ? "none" : "flex"}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        minH={"100vh"}
        w="30%"
      ></Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="left"
        width="100%"
        minH={"100vh"}
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="top"
          width="100%"
          p={2}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="left"
            width="100%"
            border={"solid"}
            borderColor="gray.400"
            borderRadius={10}
            borderWidth={1}
            p={2}
          >
            <Text
              pr={4}
              color={viewPostsFilter === "Latest" ? "blue.500" : "black"}
              onClick={() => {
                dispatch(setPostFilter("Latest"));
                router.push(`/${lang}`);
              }}
              fontWeight={viewPostsFilter === "Latest" ? "bold" : "normal"}
            >
              Latest
            </Text>
            <Text
              pr={4}
              color={viewPostsFilter === "Popular" ? "blue.500" : "black"}
              onClick={() => {
                dispatch(setPostFilter("Popular"));
                router.push(`/${lang}`);
              }}
              fontWeight={viewPostsFilter === "Popular" ? "bold" : "normal"}
            >
              Popular
            </Text>
            <Text
              color={viewPostsFilter === "Category" ? "blue.500" : "black"}
              onClick={() => {
                dispatch(setPostFilter("Category"));
                router.push(`/${lang}`);
              }}
              fontWeight={viewPostsFilter === "Category" ? "bold" : "normal"}
            >
              Category
            </Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            alignItems="right"
            width="100%"
            p={2}
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              alignItems="right"
              width="100%"
              p={2}
              color={path.includes(`/${lang}/events`) ? "blue.500" : "black"}
              onClick={() => {
                router.push(`/${lang}/events`);
              }}
              fontWeight={path.includes(`/${lang}/events`) ? "bold" : "normal"}
            >
              <Text pr={4}>Events</Text>
            </Box>
            {/* <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              alignItems="right"
              width="100%"
              p={2}
              color={
                path.includes(`/${lang}/presentations`) ? "blue.500" : "black"
              }
              onClick={() => {
                router.push(`/${lang}/presentations`);
              }}
              fontWeight={
                path.includes(`/${lang}/presentations`) ? "bold" : "normal"
              }
            >
              <Text>Presentations</Text>
            </Box> */}
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          {children}
        </Box>
      </Box>

      <Box
        display={isMobile ? "none" : "flex"}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        minH={"100vh"}
        w="30%"
      ></Box>
    </Box>
  );
};

export default Top;
