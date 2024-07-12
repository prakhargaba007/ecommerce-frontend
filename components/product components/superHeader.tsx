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
  Title,
  rem,
  Select,
} from "@mantine/core";
import { useState } from "react";
import { IconCarSuv, IconGardenCart, IconStar } from "@tabler/icons-react";
// import { useRouter } from "next/router";

function AddtoCartHandler(productId, quantity) {
  fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      productId: productId,
      quantity: quantity,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      // router.push("/"); // Replace with your desired path
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function AddToCart(props) {
  const { productId, quantity, ...rest } = props;
  // const router = useRouter();

  return (
    <Button
      onClick={() => AddtoCartHandler(productId, quantity)}
      leftSection={<IconGardenCart />}
      variant="default"
      {...rest}
    >
      Add to Cart
    </Button>
  );
}

export default function SuperHeader({ data }) {
  console.log("a", data);

  const maxQuantity = data.stock < 10 ? data.stock : 10;
  const quantityOptions = Array.from({ length: maxQuantity }, (_, i) =>
    (i + 1).toString()
  );

  const [quantity, setQuantity] = useState("1");

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
              onChange={setQuantity}
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