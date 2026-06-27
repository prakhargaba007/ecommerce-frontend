import { AppDispatch } from "../../redux/store";
import { fetchProfile, selectProfile } from "@/redux/slices/profileReducer";
import { fetchCart } from "@/redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Button,
  Group,
  Text,
  Anchor,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSearch,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";
import classes from "./HeaderMegaMenu.module.css";
import Link from "next/link";
import { ButtonMenu } from "./ButtonMenu";

export function HeaderMegaMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: any) => state.cart);
  const profile = useSelector(selectProfile);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchCart());
  }, [dispatch]);

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!userId && !!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const navLinks = ["Home", "Men", "Women", "New", "Sale"];

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return <ButtonMenu logOut={handleLogout} name={profile?.name} />;
    }
    return (
      <>
        <Link href="/user/login">
          <Button variant="subtle" size="sm" radius="md"
            styles={(theme) => ({
              root: {
                color: '#e2e8f0',
                fontWeight: 500,
                '&:hover': { background: 'rgba(255,255,255,0.06)', color: '#fff' }
              }
            })}
          >
            Log in
          </Button>
        </Link>
        <Link href="/user/signup">
          <Button size="sm" radius="md"
            styles={() => ({
              root: {
                background: '#f59e0b',
                color: '#000',
                fontWeight: 600,
                '&:hover': { background: '#d97706' }
              }
            })}
          >
            Sign up
          </Button>
        </Link>
      </>
    );
  };

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href="/" className={classes.logo}>
            <Text className={classes.logoText}>ShopHub</Text>
          </Link>

          <Group h="100%" gap="xl" visibleFrom="md" className={classes.nav}>
            {navLinks.map((link) => (
              <Link key={link} href={link === "Home" ? "/" : "#"} className={classes.navLink}>
                {link}
              </Link>
            ))}
          </Group>

          <Group gap="xs">
            <Button variant="subtle" size="sm" radius="xl" className={classes.iconBtn}>
              <IconSearch size={20} stroke={1.5} />
            </Button>

            <Group visibleFrom="sm">
              {renderAuthButtons()}
            </Group>

            <Link href="/cart" className={classes.cartBtn}>
              <IconShoppingCart size={22} stroke={1.5} />
              {products?.products?.length > 0 && (
                <span className={classes.cartBadge}>{products.products.length}</span>
              )}
            </Link>

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="md"
              size="sm"
              color="#e2e8f0"
            />
          </Group>
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Menu"
        hiddenFrom="md"
        zIndex={1000000}
        styles={{
          root: { background: '#0f172a' },
          header: { background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)' },
          body: { background: '#0f172a' },
          title: { color: '#fff', fontWeight: 600 },
        }}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <div className={classes.mobileLinks}>
            {navLinks.map((link) => (
              <Link key={link} href={link === "Home" ? "/" : "#"} className={classes.mobileLink}>
                {link}
              </Link>
            ))}
          </div>
          <div className={classes.mobileAuth}>
            {renderAuthButtons()}
          </div>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
