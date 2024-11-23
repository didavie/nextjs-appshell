import { extendTheme } from "@chakra-ui/react";

export const MobileNavHeight = 15;
export const MobileNavHeightLocationBar = 10;

// font sizes
export const FontSizeXXXS = "0.4rem";
export const FontSizeXXS = "0.6rem";
export const FontSizeXS = "0.7rem";
export const FontSizeSM = ".8rem";
export const FontSizeMD = "0.9rem";
export const FontSizeL = "1rem";
export const FontSizeLG = "1.1rem";
export const FontSizeXL = "1.3rem";
export const FontSizeXXL = "1.5rem";
export const FontSizeXXXL = "1.7rem";
export const FontSizeXXXXL = "1.9rem";
export const FontSizeXXXXXL = "2.1rem";

// colors

// spacing
export const SpacingXXS = 1;
export const SpacingXS = 2;
export const SpacingSM = 4;
export const SpacingMD = 8;
export const SpacingLG = 16;
export const SpacingXL = 32;

// border radius
export const BorderRadiusXS = 2;
export const BorderRadiusSM = 4;
export const BorderRadiusMD = 8;
export const BorderRadiusLG = 16;

// shadows
export const ShadowXS = "0px 2px 4px rgba(0, 0, 0, 0.05)";
export const ShadowSM = "0px 4px 8px rgba(0, 0, 0, 0.05)";
export const ShadowMD = "0px 8px 16px rgba(0, 0, 0, 0.05)";

// z-index
export const ZIndexXS = 1;
export const ZIndexSM = 2;
export const ZIndexMD = 3;

export const theme = extendTheme({
  colors: {
    primary: {
      50: "#e9f5f2",
      100: "#d4ebe6",
      200: "#a9d8cd",
      300: "#7ec4b4",
      400: "#53b09b",
      500: "#3d967d",
      600: "#2f745f",
      700: "#215140",
      800: "#132222",
      900: "#040404",
    },
    secondary: {
      50: "#f5f5f5",
      100: "#ebebeb",
      200: "#d4d4d4",
      300: "#bdbdbd",
      400: "#a6a6a6",
      500: "#8f8f8f",
      600: "#737373",
      700: "#575757",
      800: "#3b3b3b",
      900: "#1e1e1e",
    },
    tertiary: {
      50: "#f5f5f5",
      100: "#ebebeb",
      200: "#d4d4d4",
      300: "#bdbdbd",
      400: "#a6a6a6",
      500: "#8f8f8f",
      600: "#737373",
      700: "#575757",
      800: "#3b3b3b",
      900: "#1e1e1e",
    },
    accent: {
      50: "#f5f5f5",
      100: "#ebebeb",
      200: "#d4d4d4",
      300: "#bdbdbd",
      400: "#a6a6a6",
      500: "#8f8f8f",
      600: "#737373",
      700: "#575757",
      800: "#3b3b3b",
      900: "#1e1e1e",
    },
    danger: {
      50: "#fde8e8",
      100: "#fbd1d1",
      200: "#f8a3a3",
      300: "#f57575",
      400: "#f24747",
      500: "#f02a2a",
      600: "#c92323",
      700: "#961b1b",
      800: "#651414",
      900: "#340c0c",
    },
    warning: {
      50: "#fef7e5",
      100: "#fdf0cb",
      200: "#fae196",
      300: "#f7cd61",
      400: "#f4b72c",
      500: "#f2a00a",
      600: "#c17f08",
      700: "#906008",
      800: "#604007",
      900: "#302003",
    },
    success: {
      50: "#e9f5f2",
      100: "#d4ebe6",
      200: "#a9d8cd",
      300: "#7ec4b4",
      400: "#53b09b",
      500: "#3d967d",
      600: "#2f745f",
      700: "#215140",
      800: "#132222",
      900: "#040404",
    },
    info: {
      50: "#e9f5f2",
      100: "#d4ebe6",
      200: "#a9d8cd",
      300: "#7ec4b4",
      400: "#53b09b",
      500: "#3d967d",
      600: "#2f745f",
      700: "#215140",
      800: "#132222",
      900: "#040404",
    },
  },
  fonts: {
    body: "Roboto, sans-serif",
    heading: "Roboto, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: BorderRadiusMD,
      },
    },
    Input: {
      baseStyle: {
        borderRadius: BorderRadiusMD,
      },
    },
    Text: {
      baseStyle: {
        fontSize: FontSizeMD,
      },
    },
    Heading: {
      baseStyle: {
        fontSize: FontSizeXL,
      },
    },
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: "none",
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: BorderRadiusMD,
        },
      },
    },
    Popover: {
      baseStyle: {
        content: {
          borderRadius: BorderRadiusMD,
        },
      },
    },
    Tooltip: {
      baseStyle: {
        content: {
          borderRadius: BorderRadiusMD,
        },
      },
    },
  },
});

export const MaxMobileWidth = "768px";
export const MaxDesktopWidth = "1200px";
