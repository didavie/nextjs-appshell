"use client";
import { Box, chakra, shouldForwardProp } from "@chakra-ui/react";
import { i18n, type Locale } from "i18n-config";
import { defaultColor } from "@/config/colors";
import { isValidMotionProp, motion } from "framer-motion";
import { isMobile } from "react-device-detect";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const AhiLoading = () => {
  const ChakraBox = chakra(motion.div, {
    /**
     * Allow motion props and non-Chakra props to be forwarded.
     */
    shouldForwardProp: (prop) =>
      isValidMotionProp(prop) || shouldForwardProp(prop),
  });

  const ChakraText = chakra(motion.p, {
    /**
     * Allow motion props and non-Chakra props to be forwarded.
     */
    shouldForwardProp: (prop) =>
      isValidMotionProp(prop) || shouldForwardProp(prop),
  });
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      h="80vh"
      w={isMobile ? "100vw" : "100%"}
      // bg="black"
    >
      <ChakraBox
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        // @ts-ignore no problem in operation, although type error appears.
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        padding="2"
        bg={"#f0f0f0"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="fit-content"
        height="100px"
        boxShadow="0 0 10px rgba(0,0,0,0.1)"
      >
        <ChakraText
          fontWeight="bold"
          fontFamily="'Emilys Candy', serif"
          height="40px"
          width="fit-content"
          animate={{
            scale: [1, 1.5, 1.5, 1, 1],
          }}
          // @ts-ignore no problem in operation, although type error appears.
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          MECOFE
        </ChakraText>
      </ChakraBox>
    </Box>
  );
};
export default AhiLoading;
