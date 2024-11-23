// app/providers.tsx
"use client";
import "@mantine/core/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "../../../../redux/store/store";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <ChakraProvider>{children}</ChakraProvider>
      </MantineProvider>
    </Provider>
  );
}
