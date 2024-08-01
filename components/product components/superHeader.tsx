"use client";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import classes from "./superHeader.module.css";
import {
  Button,
  ButtonProps,
  Group,
  Image,
  Text,
  rem,
  Select,
} from "@mantine/core";
import { useState } from "react";
import { IconCarSuv, IconGardenCart, IconStar } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { AppDispatch } from "@/redux/store";

type AddToCartProps = {
  productId: string;
  quantity: string;
} & ButtonProps;

export function AddToCart(props: AddToCartProps) {
  const { productId, quantity, ...rest } = props;
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    dispatch(addToCart({ productId, quantity }))
      .unwrap()
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Button
      onClick={handleAddToCart}
      leftSection={<IconGardenCart />}
      variant="default"
      {...rest}
    >
      Add to Cart
    </Button>
  );
}

type ProductData = {
  _id: string;
  name: string;
  price: number;
  brand: string;
  color: string;
  fabric: string;
  gender: string;
  stock: number;
  images: string[];
};

type SuperHeaderProps = {
  data: ProductData;
};

export default function SuperHeader({ data }: SuperHeaderProps) {
  console.log("a", data);

  const maxQuantity = data.stock < 10 ? data.stock : 10;
  const quantityOptions = Array.from({ length: maxQuantity }, (_, i) =>
    (i + 1).toString()
  );

  const [quantity, setQuantity] = useState<string>("1");

  const slides = data?.images?.map((image, index) => (
    <Carousel.Slide className={classes.slide} key={index}>
      <Image className={classes.image} src={image} alt={`Slide ${index}`} />
    </Carousel.Slide>
  ));

  return (
    <div className={classes.container}>
      <Carousel loop className={classes.carousel} withIndicators>
        {slides}
      </Carousel>
      <div className={classes.details}>
        <div className={classes.details1}>
          <h2>{data.name}</h2>
          <div className={classes.details2}>
            <h1>₹{data.price}</h1>
            <Group gap={5}>
              <IconStar style={{ width: rem(16), height: rem(16) }} />
              <Text fz="xs" fw={500}>
                4.78
              </Text>
            </Group>
          </div>
          <div>
            <h3>Features</h3>
            <ul>
              <li>Brand: {data.brand}</li>
              <li>Color: {data.color}</li>
              <li>Fabric: {data.fabric}</li>
              <li>Gender: {data.gender}</li>
            </ul>
          </div>
          <div className={classes.details3}>
            <Select
              value={quantity}
              onChange={(value) => setQuantity(value!)}
              data={quantityOptions.map((q) => ({ value: q, label: q }))}
              placeholder="Quantity"
              className={classes.quantitySelect}
            />
            <AddToCart productId={data._id} quantity={quantity}>
              Add to Cart
            </AddToCart>
            <Button className={classes.buyNow}>
              <div>
                <IconCarSuv stroke={1.5} />
              </div>
              <div>Buy Now</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
