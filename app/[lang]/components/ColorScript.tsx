// app/providers.tsx
"use client";
import "@mantine/core/styles.css";

import { createTheme } from "@mantine/core";
import Head from "next/head";
import { ColorSchemeScript } from "@mantine/core";

export function ColorScript() {
  return (
    <Head>
      <ColorSchemeScript defaultColorScheme="auto" />
    </Head>
  );
}
