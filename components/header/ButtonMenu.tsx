import { Button, Menu, Text, rem, useMantineTheme } from "@mantine/core";
import {
  IconSquareCheck,
  IconPackage,
  IconUsers,
  IconCalendar,
  IconChevronDown,
  IconUserCircle,
  IconLogout,
  IconHome,
} from "@tabler/icons-react";
import Link from "next/link";

export function ButtonMenu({ logOut }) {
  const theme = useMantineTheme();
  return (
    <Menu
      transitionProps={{ transition: "pop-top-right" }}
      position="top-end"
      width={220}
      withinPortal
    >
      <Menu.Target>
        <Button>P</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Link href={`/user/orders`}>
          <Menu.Item
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
        <Link href={`/user/profile`}>
          <Menu.Item
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
        <Link href={`/user/address`}>
          <Menu.Item
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
