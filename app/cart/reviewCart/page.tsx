"use client";
import { useEffect, useState, Suspense } from "react";
import { Button, Text, Title, Notification } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import classes from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, selectCartProducts } from "@/redux/slices/cartSlice";
import { AppDispatch } from "@/redux/store";

declare global {
  interface Window {
    Razorpay: any; // Define the type of Razorpay object if possible
  }
}

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  totalPrice: number;
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
  isDefault: boolean;
};

type NotificationState = {
  message: string;
  color: "red" | "green";
};

const ConfirmationPageContent: React.FC = () => {
  const [address, setAddress] = useState<Address | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );

  const searchParams = useSearchParams();
  const addressId = searchParams.get("address");

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector(selectCartProducts);
  console.log(cart);

  useEffect(() => {
    dispatch(fetchCart());

    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/address/${addressId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setAddress(data);
      } catch (error) {
        console.error("Error fetching address data:", error);
        setNotification({
          message: "Error fetching address data",
          color: "red",
        });
        setTimeout(() => {
          setNotification(null);
        }, 1500);
      }
    };

    if (addressId) {
      fetchAddress();
    }
  }, [addressId, dispatch]);

  const handlePlaceOrder = async () => {
    if (!cart) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: cart.totalPrice,
          }),
        }
      );

      const data = await res.json();
      await handlePaymentVerify(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentVerify = async (data: any) => {
    let token = localStorage.getItem("token");
    console.log(token);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Devknus",
      description: "Test Mode",
      order_id: data.id,
      handler: async (response: any) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`,
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                address,
                token: token,
              }),
            }
          );

          const verifyData = await res.json();

          if (verifyData.staus == 201) {
            toast.success(verifyData.message);
            await confirmOrder(verifyData.payment._id);
            // router.push(`/user/success?oi=${data.order._id}`);
          }

          // Call the function to confirm the order
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#5f63b8",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const confirmOrder = async (paymentId: string) => {
    if (!address) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            shippingAddressId: address._id,
            payment: paymentId,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Order confirmed successfully");
        router.push(`/user/success?oi=${data.order._id}`);
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("Error confirming order");
    }
  };

  if (!cart || !address) {
    return <Text>Loading...</Text>;
  }

  const totalPrice = cart.products?.reduce(
    (acc: any, item: any) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className={classes.confirmationContainer}>
      <Title order={2}>Order Confirmation</Title>
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
      <div className={classes.cartItems}>
        {cart.products?.map((item: any) => (
          <div key={item.product._id} className={classes.cartItem}>
            <Text className={classes.productName}>{item.product.name}</Text>
            <Text className={classes.productPrice}>₹{item.product.price}</Text>
            <Text className={classes.quantity}>Quantity: {item.quantity}</Text>
            <Text className={classes.itemTotalPrice}>
              ₹{(item.product.price * item.quantity).toFixed(2)}
            </Text>
          </div>
        ))}
      </div>
      <div className={classes.totalPrice}>
        <Text>Total Price: ₹{totalPrice?.toFixed(2)}</Text>
      </div>
      <div className={classes.addressDetails}>
        <Title order={4}>Shipping Address</Title>
        <Text>{address.name}</Text>
        <Text>{address.phoneNumber}</Text>
        <Text>{address.street}</Text>
        <Text>
          {address.city}, {address.state}, {address.country}
        </Text>
        <Text>{address.postalCode}</Text>
      </div>
      <Button className={classes.placeOrderButton} onClick={handlePlaceOrder}>
        Pay and Place Order
      </Button>
    </div>
  );
};

const ConfirmationPage: React.FC = () => {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ConfirmationPageContent />
    </Suspense>
  );
};

export default ConfirmationPage;
