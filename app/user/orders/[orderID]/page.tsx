"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Text, Title, Notification, Loader } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import Link from "next/link";
import classes from "./page.module.css";
import ReviewForm from "../../../../components/product components/ReviewForm";
import Image from "next/image";

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
  review?: string;
};

type OrderProduct = {
  product: Product;
  quantity: number;
  price: number;
  review?: any;
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

type NotificationType = {
  message: string;
  color: "red" | "green";
};

type Params = {
  params: {
    orderID: string;
  };
};

const OrderDetailPage: React.FC<Params> = ({ params }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );

  const orderId = params.orderID.split("-")[0];
  const productId = params.orderID.split("-")[1];

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${orderId}`,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          const data: Order = await response.json();
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
    }
  }, [orderId]);

  if (!order) {
    return <Text>Loading...</Text>;
  }

  const product = order.products.find((item) => item.product._id === productId);
  console.log(product);

  if (!product) {
    return <Text>Product not found in this order.</Text>;
  }

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <div className={classes.orderDetailContainer}>
        <Title order={2}>Order ID: {order._id}</Title>
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
          <Link href={`/product/${productId}`}>
            <div className={classes.productCard}>
              <img
                src={product.product.images[0]}
                alt={product.product.name}
                className={classes.productImage}
              />
              <div className={classes.productInfo}>
                <Title order={3}>{product.product.name}</Title>
                <Text className={classes.productDescription}>
                  {product.product.description}
                </Text>
                <Text>Price: ₹{product.price.toFixed(2)}</Text>
                <Text>Quantity: {product.quantity}</Text>
                <Text>
                  Total: ₹{(product.price * product.quantity).toFixed(2)}
                </Text>
              </div>
            </div>
          </Link>
          {order.status === "Delivered" && (
            <div className={classes.ratingInfo}>
              <Title order={3}>Your Review</Title>
              <ReviewForm
                orderId={orderId}
                productId={productId}
                // productReview={{}}
                productReview={product.review}
              />
            </div>
          )}
          <div className={classes.shippingInfo}>
            <Title order={3}>Shipping Address</Title>
            <Text>
              <strong>Name:</strong> {order.shippingAddress.name}
            </Text>
            <Text>
              <strong>Phone:</strong> {order.shippingAddress.phoneNumber}
            </Text>
            <Text>
              <strong>Address:</strong> {order.shippingAddress.street},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
              {order.shippingAddress.country} -{" "}
              {order.shippingAddress.postalCode}
            </Text>
          </div>
          <div className={classes.statusInfo}>
            <Title order={3}>Order Status</Title>
            <Text>
              <strong>Status:</strong> {order.status}
            </Text>
            <Text>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </Text>
            <Text>
              <strong>Total Price:</strong> ₹{order.totalPrice.toFixed(2)}
            </Text>
          </div>
        </div>
        <div className={classes.orderProducts}>
          <Title order={3}>Other Products in this Order</Title>
          {order.products.map((item) => (
            <Link
              key={item.product._id}
              href={`/user/orders/${orderId}-${item.product._id}`}
            >
              <div className={classes.productListItem}>
                <Image
                  className={classes.productListImage}
                  src={item.product.images[0]}
                  width={80}
                  height={80}
                  alt={item.product.name}
                />
                <div className={classes.productListInfo}>
                  <Text className={classes.productName}>
                    {item.product.name}
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
    </Suspense>
  );
};

export default OrderDetailPage;
