"use client";
import { Breakpoints } from "@/config/ui";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setPostFilter } from "@/redux/actions/post";
import { RootState } from "@/redux/store/store";
import { Box, Button, Text, useMediaQuery } from "@chakra-ui/react";
import { Locale } from "i18n-config";
import { usePathname } from "next/navigation";
import useAppRouter from "@/hooks/useAppRouter";

import { useSigninCheck } from "reactfire";
import { Dictionary } from "get-dictionary";

const Top = ({
  children,
  lang,
  dictionary,
}: {
  children: React.ReactNode;
  lang: Locale;
  dictionary: Dictionary;
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
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            width="fit-content"
            border={"solid"}
            borderColor="gray.400"
            borderRadius={10}
            borderWidth={1}
            p={2}
            pr={4}
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
              {dictionary.latest}
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
              {dictionary.popular}
            </Text>
            <Text
              color={viewPostsFilter === "Category" ? "blue.500" : "black"}
              onClick={() => {
                dispatch(setPostFilter("Category"));
                router.push(`/${lang}`);
              }}
              fontWeight={viewPostsFilter === "Category" ? "bold" : "normal"}
            >
              {dictionary.category}
            </Text>
          </Box>
          <Box
            display={isMobile ? "none" : "flex"}
            flexDirection="row"
            justifyContent="flex-end"
            alignItems="right"
            width="100%"
            p={2}
          >
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => {
                router.push(`/${lang}/post/create`);
              }}
            >
              {dictionary.createPost}
            </Button>
          </Box>
          <Box
            display={isMobile ? "none" : "flex"}
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
              color={"blue.500"}
              onClick={() => {
                router.push(`/${lang}/events`);
              }}
              fontWeight={path.includes(`/${lang}/events`) ? "bold" : "normal"}
            >
              <Text pr={4}>{dictionary.events}</Text>
            </Box>
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
    </Box>
  );
};

export default Top;
