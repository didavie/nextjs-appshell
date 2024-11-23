"use client";

import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
import {} from "@/models/models";
import { Locale } from "i18n-config";

import { Box, Text } from "@chakra-ui/react";

const Page = async ({
  params: { lang, id },
}: {
  params: { lang: Locale; id: string };
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="left"
      width="100%"
      minH={"100vh"}
    >
      <Text>No Event Found</Text>
    </Box>
  );
};

export default Page;
