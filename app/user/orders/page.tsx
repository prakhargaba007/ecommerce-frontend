"use client";
import { useEffect, useState } from "react";
import { Text, Title, Notification } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import Link from "next/link";
import classes from "./page.module.css";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  gender: string;
  fabric: string;
  color: string;
  size: string;
  brand: string;
  images: string[];
};

type OrderProduct = {
  product: Product;
  quantity: number;
  price: number;
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
  products: OrderProduct[];
  totalPrice: number;
  status: string;
  shippingAddress: Address;
  payment: string;
  createdAt: string;
  updatedAt: string;
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    color: "red" | "green";
  } | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/order",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();

        // Sort orders by createdAt date in descending order
        data.sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setOrders(data);
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

    fetchOrders();
  }, []);

  if (!orders.length) {
    return <Text>Loading...</Text>;
  }

  return (
    <div className={classes.ordersContainer}>
      <Title order={2}>My Orders</Title>
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
      <div className={classes.ordersList}>
        {orders.map((order) => (
          <div key={order._id} className={classes.orderCard}>
            <Title order={4}>Order ID: {order._id}</Title>
            <Text>Status: {order.status}</Text>
            <Text>
              Order Date: {new Date(order.createdAt).toLocaleString()}
            </Text>
            <Text>Total Price: ₹{order.totalPrice.toFixed(2)}</Text>
            <div className={classes.productDetails}>
              {order.products.map((item) => (
                <Link
                  key={item.product._id}
                  href={`/user/orders/${order._id}-${item.product._id}`}
                >
                  <div className={classes.productCard}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className={classes.productImage}
                    />
                    <div className={classes.productInfo}>
                      <Text className={classes.productName}>
                        {item.product.name}
                      </Text>
                      <Text className={classes.productDescription}>
                        {item.product.description}
                      </Text>
                      <Text className={classes.productPrice}>
                        Price: ₹{item.price.toFixed(2)}
                      </Text>
                      <Text className={classes.productQuantity}>
                        Quantity: {item.quantity}
                      </Text>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
