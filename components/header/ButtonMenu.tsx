import { Button, Menu, rem, useMantineTheme } from "@mantine/core";
import {
  IconPackage,
  IconUserCircle,
  IconLogout,
  IconHome,
} from "@tabler/icons-react";
import Link from "next/link";

type ButtonMenuProps = {
  logOut: () => void;
  name: string | undefined;
};

export function ButtonMenu({ logOut, name }: ButtonMenuProps) {
  const theme = useMantineTheme();
  const buttonLabel = typeof name === "string" ? name[0] : "";

  return (
    <Menu
      transitionProps={{ transition: "pop-top-right" }}
      position="top-end"
      width={220}
      withinPortal
    >
      <Menu.Target>
        <Button>{buttonLabel}</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Link href="/user/orders" passHref>
          <Menu.Item
            component="a"
            leftSection={
              <IconPackage
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            }
          >
            Orders
          </Menu.Item>
        </Link>
        <Link href="/user/profile" passHref>
          <Menu.Item
            component="a"
            leftSection={
              <IconUserCircle
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.pink[6]}
                stroke={1.5}
              />
            }
          >
            Profile
          </Menu.Item>
        </Link>
        <Link href="/user/address" passHref>
          <Menu.Item
            component="a"
            leftSection={
              <IconHome
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.cyan[6]}
                stroke={1.5}
              />
            }
          >
            Address
          </Menu.Item>
        </Link>
        <Menu.Item
          leftSection={
            <IconLogout
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.violet[6]}
              stroke={1.5}
            />
          }
          onClick={logOut}
        >
          Sign Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
