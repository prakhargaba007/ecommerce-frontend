"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Text,
  Title,
  NumberInput,
  ActionIcon,
  Notification,
  Select,
} from "@mantine/core";
import { IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import classes from "./page.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link from next/link

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
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

type CartItemProps = {
  product: Product;
  quantity: number;
  onQuantityChange: (productId: string, quantity: number) => void;
  onDelete: (productId: string) => void;
};

const CartItem: React.FC<CartItemProps> = ({
  product,
  quantity,
  onQuantityChange,
  onDelete,
}) => {
  const handleQuantityChange = (value: string | number) => {
    const numberValue = typeof value === "string" ? parseInt(value, 10) : value;
    if (!isNaN(numberValue)) {
      onQuantityChange(product._id, numberValue);
    }
  };

  return (
    <div className={classes.cartItem}>
      <Text className={classes.productName}>{product.name}</Text>
      <Text className={classes.productPrice}>₹{product.price}</Text>
      <NumberInput
        className={classes.quantityInput}
        value={quantity}
        onChange={handleQuantityChange}
        min={1}
        max={product.stock < 10 ? product.stock : 10}
      />
      <Text className={classes.itemTotalPrice}>
        ₹{(product.price * quantity).toFixed(2)}
      </Text>
      <ActionIcon
        onClick={() => onDelete(product._id)}
        className={classes.deleteIcon}
      >
        <IconTrash />
      </ActionIcon>
    </div>
  );
};

const Cart: React.FC = () => {
  const router = useRouter();
  const [cart, setCart] = useState<{
    products: { product: Product; quantity: number }[];
  } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  console.log("2", selectedAddress);

  const [notification, setNotification] = useState<{
    message: string;
    color: "red" | "green";
  } | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/cart",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setNotification({
          message: "Error fetching cart data",
          color: "red",
        });
        setTimeout(() => {
          setNotification(null);
        }, 1500);
      }
    };

    const fetchAddresses = async () => {
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
        const defaultAddress = data.find(
          (address: Address) => address.isDefault
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setNotification({
          message: "Error fetching addresses",
          color: "red",
        });
        setTimeout(() => {
          setNotification(null);
        }, 1500);
      }
    };

    fetchCart();
    fetchAddresses();
  }, []);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            productId: productId,
            quantity: quantity,
          }),
        }
      );
      const data = await response.json();
      setCart(data.cart);
      setNotification({
        message: "Cart updated successfully",
        color: "green",
      });
      setTimeout(() => {
        setNotification(null);
      }, 1500);
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      setNotification({
        message: "Error updating cart quantity",
        color: "red",
      });
      setTimeout(() => {
        setNotification(null);
      }, 1500);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setCart(data.cart);
      setNotification({
        message: "Product removed from cart",
        color: "green",
      });
      setTimeout(() => {
        setNotification(null);
      }, 1500);
    } catch (error) {
      console.error("Error deleting cart item:", error);
      setNotification({
        message: "Error deleting cart item",
        color: "red",
      });
      setTimeout(() => {
        setNotification(null);
      }, 1500);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      router.push(`/cart/reviewCart?address=${selectedAddress}`);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (!cart) {
    return <Text>Loading...</Text>;
  }

  const totalPrice = cart.products?.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className={classes.cartContainer}>
      <Title order={2}>Your Cart</Title>
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
        {cart.products?.map((item) => (
          <CartItem
            key={item.product._id}
            product={item.product}
            quantity={item.quantity}
            onQuantityChange={handleQuantityChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <Select
        className={classes.addressSelect}
        placeholder="Select address"
        value={selectedAddress}
        onChange={(value) => setSelectedAddress(value || "")}
        data={addresses.map((address) => ({
          value: address._id,
          label: `${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.postalCode}`,
        }))}
      />
      <Link href="/user/address/addAddress">
        <Button variant="outline" className={classes.addAddressButton}>
          Add New Address
        </Button>
      </Link>
      <div className={classes.totalPrice}>
        <Text>Total Price: ₹{totalPrice}</Text>
      </div>
      <Button
        className={classes.placeOrderButton}
        onClick={handlePlaceOrder}
        disabled={!selectedAddress || cart.products.length === 0}
      >
        Proceed to checkout
      </Button>
    </div>
  );
};

export default Cart;
