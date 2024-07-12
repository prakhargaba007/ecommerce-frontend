"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Container,
  Text,
  Title,
  Card,
  Group,
  Stack,
  Menu,
  ActionIcon,
  Loader,
} from "@mantine/core";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import classes from "./page.module.css";

type Address = {
  _id: string;
  name: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdAt: string;
};

const AddressesList: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/address",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setAddresses(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/address/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      await response.json();
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className={classes.ordersContainer}>
      <Title order={2} mb="xl">
        Your Addresses
      </Title>
      <Link href="/user/address/addAddress">
        <Button className={classes.addButton} variant="outline" mb="xl">
          Add New Address
        </Button>
      </Link>
      <Stack>
        {addresses.map((address) => (
          <Card
            key={address._id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Group mb="xs">
              <Text w={500}>{address.name}</Text>
              <Menu withinPortal position="bottom-end" shadow="sm">
                <Menu.Target>
                  <ActionIcon>
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Link href={`/user/address/addAddress?id=${address._id}`}>
                    <Menu.Item leftSection={<IconPencil size={14} />}>
                      Edit
                    </Menu.Item>
                  </Link>
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    onClick={() => handleDelete(address._id)}
                    color="red"
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
            <Text>
              {address.street}, {address.city}
            </Text>
            <Text>
              {address.state}, {address.country}
            </Text>
            <Text>{address.postalCode}</Text>
            <Text>{address.phoneNumber}</Text>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default AddressesList;
