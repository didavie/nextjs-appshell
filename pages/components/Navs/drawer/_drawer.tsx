import { Drawer } from "@mantine/core";
import Link from "next/link";

const NavDrawer = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      padding="xl"
      size="sm"
      withCloseButton={false}
      transitionDuration={500}
      transition="slide-left"
      position="right"
    >
      <Link href="/dashboard">Dashboard</Link>
    </Drawer>
  );
};

export default NavDrawer;
