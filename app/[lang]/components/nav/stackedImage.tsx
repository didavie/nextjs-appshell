import { Box, Flex } from "@chakra-ui/react";
import { useState, useMemo, useRef, useEffect } from "react";

const images = [
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.20__1_-removebg-preview.png",
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.20-removebg-preview.png",
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.21__1_-removebg-preview.png",
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.21__2_-removebg-preview.png",
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.21-removebg-preview.png",
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.22__1_-removebg-preview.png",
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.22-removebg-preview.png",
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.23__1_-removebg-preview.png",
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.23__2_-removebg-preview.png",
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.23-removebg-preview.png",
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.24__1_-removebg-preview.png",
  "/photos/WhatsApp_Image_2023-10-13_at_22.18.25-removebg-preview.png",
];

export const StackedImageAnimation = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const size = useMemo(() => images.length, []);
  const timer = useRef<NodeJS.Timeout | number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const map = useMemo(() => {
    const map = new Map<number, number>();
    const len = images.length;
    let i = len;

    if (len < activeIndex || activeIndex < 0)
      throw new Error("Invalid index set as active index");

    while (i > 0) {
      map.set((activeIndex + len - i) % len, --i);
    }

    return map;
  }, [activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handler = () => {
      const { width } = container.getBoundingClientRect();
      setContainerWidth(width);
    };

    handler();

    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    timer.current = setInterval(
      () => setActiveIndex((cur) => (cur + 1) % size),
      5000
    );

    return () => clearInterval(timer.current as number);
  }, [size]);

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box
        position="relative"
        width={{ base: "100vw", md: "100vw", xl: "60vw" }}
        height={{ base: 210, md: 350, xl: 450 }}
        ref={containerRef}
      >
        {images.map((image, i) => {
          const factor = size - 1 - map.get(i)!;
          const isPreviousActiveIndex = (activeIndex + size - 1) % size === i;

          return (
            <Box
              key={image}
              top={0}
              right={0 - 0.09 * factor * containerWidth}
              borderRadius="lg"
              position="absolute"
              backgroundImage={`url(${image})`}
              backgroundSize="contain"
              backgroundRepeat="no-repeat"
              backgroundPosition={{ base: "center", md: "top" }}
              backgroundColor={isPreviousActiveIndex ? "transparent" : "white"}
              width="inherit"
              height="inherit"
              zIndex={map.get(i)}
              boxShadow={
                isPreviousActiveIndex ? "0 0 10px rgba(0, 0, 0, 0.1)" : "none"
              }
              transition={"z-index 0.6s ease, transform 0.6s ease".concat(
                isPreviousActiveIndex ? ", right 0.3s ease" : ""
              )}
            ></Box>
          );
        })}
      </Box>
    </Flex>
  );
};
