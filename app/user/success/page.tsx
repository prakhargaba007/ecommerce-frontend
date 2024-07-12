"use client";
import { useEffect, useState } from "react";
import { Lin, useSearchParams } from "next/navigation";
import { Button, Text, Title, Notification } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import classes from "./page.module.css";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

type Address = {
  _id: string;
  user: string;
  name: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

type Order = {
  _id: string;
  user: string;
  products: Product[];
  totalPrice: number;
  status: string;
  shippingAddress: Address;
  payment: string;
  createdAt: string;
  updatedAt: string;
};

const SuccessPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    color: "red" | "green";
  } | null>(null);

  const searchParams = useSearchParams();
  const orderId = searchParams.get("oi");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/order/" + orderId,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setNotification({
          message: "Error fetching order data",
          color: "red",
        });
        setTimeout(() => {
          setNotification(null);
        }, 1500);
      }
    };

    fetchOrder();
  }, []);

  if (!order) {
    return <Text>Loading...</Text>;
  }

  return (
    <div className={classes.successContainer}>
      <Title order={2}>Order Successful</Title>
      {notification && (
        <Notification
          icon={notification.color === "green" ? <IconCheck /> : <IconX />}
          color={notification.color}
          onClose={() => setNotification(null)}
          className={classes.notification}
        >
          {notification.message}
        </Notification>
      )}
      <div className={classes.orderDetails}>
        <Title order={3}>Order Details</Title>
        <Text>Order ID: {order._id}</Text>
        <Text>Status: {order.status}</Text>
        <Text>Order Date: {new Date(order.createdAt).toLocaleString()}</Text>
        <div className={classes.products}>
          {order.products.map((item) => (
            <div key={item._id} className={classes.product}>
              <Text className={classes.productName}>{item.name}</Text>
              <Text className={classes.productPrice}>
                ₹{item.price.toFixed(2)}
              </Text>
              <Text className={classes.productQuantity}>
                Quantity: {item.quantity}
              </Text>
              <Text className={classes.itemTotalPrice}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </Text>
            </div>
          ))}
        </div>
        <div className={classes.totalPrice}>
          <Text>Total Price: ₹{order.totalPrice.toFixed(2)}</Text>
        </div>
        <div className={classes.shippingAddress}>
          <Title order={4}>Shipping Address</Title>
          <Text>{order.shippingAddress.name}</Text>
          <Text>{order.shippingAddress.phoneNumber}</Text>
          <Text>{order.shippingAddress.street}</Text>
          <Text>
            {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
            {order.shippingAddress.country}
          </Text>
          <Text>{order.shippingAddress.postalCode}</Text>
        </div>
      </div>
      <Link href="/">
        <Button className={classes.continueShoppingButton}>
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

export default SuccessPage;
