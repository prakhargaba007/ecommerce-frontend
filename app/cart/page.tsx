"use client";
import { useState, useEffect } from "react";
import {
  Button,
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
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateQuantity,
  removeProduct,
  selectCartProducts,
} from "@/redux/slices/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import useFetch from "@/hooks/useFetch";

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
  const dispatch = useDispatch<AppDispatch>();
  const cartProducts = useSelector(selectCartProducts);
  console.log(cartProducts);

  const cartLoading = useSelector(
    (state: RootState | any) => state.cart.loading
  );
  const cartError = useSelector((state: RootState | any) => state.cart.error);

  const [addresses, setAddresses] = useState<Address[] | null>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const [notification, setNotification] = useState<{
    message: string;
    color: "red" | "green";
  } | null>(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const { data, loading, error, get } = useFetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/address"
  );
  console.log(1, data);

  // useEffect(() => {
  //   const fetchAddresses = async () => {
  //     await get();
  //     setAddresses(data);
  //   };
  //   fetchAddresses();
  // }, []);
  useEffect(() => {
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

  const handleQuantityChange = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }))
      .unwrap()
      .then(() => {
        setNotification({
          message: "Cart updated successfully",
          color: "green",
        });
        setTimeout(() => {
          setNotification(null);
        }, 1500);
      })
      .catch((error) => {
        console.error("Error updating cart quantity:", error);
        setNotification({
          message: "Error updating cart quantity",
          color: "red",
        });
        setTimeout(() => {
          setNotification(null);
        }, 1500);
      });
  };

  const handleDelete = (productId: string) => {
    dispatch(removeProduct(productId))
      .unwrap()
      .then(() => {
        setNotification({
          message: "Product removed from cart",
          color: "green",
        });
        setTimeout(() => {
          setNotification(null);
        }, 1500);
      })
      .catch((error) => {
        console.error("Error deleting cart item:", error);
        setNotification({
          message: "Error deleting cart item",
          color: "red",
        });
        setTimeout(() => {
          setNotification(null);
        }, 1500);
      });
  };

  const handlePlaceOrder = async () => {
    try {
      router.push(`/cart/reviewCart?address=${selectedAddress}`);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (cartLoading) {
    return <Text>Loading...</Text>;
  }

  if (cartError) {
    return <Text>Error: {cartError}</Text>;
  }

  const totalPrice = Array.isArray(cartProducts?.products)
    ? cartProducts?.products.reduce(
        (acc: any, item: any) => acc + item.product.price * item.quantity,
        0
      )
    : 0;

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
        {Array.isArray(cartProducts?.products) &&
          cartProducts?.products.map((item: any) => (
            <CartItem
              key={item.product._id}
              product={item.product}
              quantity={item.quantity}
              onQuantityChange={handleQuantityChange}
              onDelete={handleDelete}
            />
          ))}
      </div>
      {loading ? (
        "Loading Address"
      ) : (
        <Select
          className={classes.addressSelect}
          placeholder="Select address"
          value={selectedAddress}
          onChange={(value) => setSelectedAddress(value || "")}
          data={addresses?.map((address) => ({
            value: address._id,
            label: `${address.name}, ${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.postalCode}`,
          }))}
        />
      )}

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
        disabled={!selectedAddress || cartProducts?.products.length === 0}
      >
        Proceed to checkout
      </Button>
    </div>
  );
};

export default Cart;
