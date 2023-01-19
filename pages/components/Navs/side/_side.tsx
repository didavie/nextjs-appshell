import { Navbar } from "@mantine/core";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";

const Side = () => {
  const matches = useMediaQuery("(max-width: 900px)");

  return (
    <Navbar
      width={{ base: 250 }}
      height={"calc(100vh)"}
      style={{
        display: matches ? "none" : "block",
        position: "fixed",
        zIndex: "1 important",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        paddingTop: "20px",
        paddingLeft: "20px",
      }}
    >
      <Navbar.Section>
        <Link href="/dashboard">Dashboard</Link>
      </Navbar.Section>
    </Navbar>
  );
};

export default Side;
