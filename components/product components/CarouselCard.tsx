"use client";
import { Image, Card, Text, Group, Button, rem } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconStar } from "@tabler/icons-react";
import classes from "./CarouselCard.module.css";
import "@mantine/carousel/styles.css";
import Link from "next/link";

type CarouselCardProps = {
  data: {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
  };
};

export function CarouselCard({ data }: CarouselCardProps) {
  const slides = data.images.map((image) => (
    <Carousel.Slide key={image}>
      <Image src={image} height={220} />
    </Carousel.Slide>
  ));

  return (
    <Card className={classes.card} radius="md" withBorder padding="xl">
      <Link href={`/product/${data._id}`}>
        <Card.Section>
          <Carousel
            withIndicators
            loop
            classNames={{
              root: classes.carousel,
              controls: classes.carouselControls,
              indicator: classes.carouselIndicator,
            }}
          >
            {slides}
          </Carousel>
        </Card.Section>

        <Group justify="space-between" mt="lg">
          <Text fw={500} fz="lg">
            {data.name}
          </Text>
        </Group>

        <Group gap={5}>
          <IconStar style={{ width: rem(16), height: rem(16) }} />
          <Text fz="xs" fw={500}>
            4.78
          </Text>
        </Group>

        <Text fz="sm" c="dimmed" mt="sm">
          {data.description}
        </Text>
      </Link>

      <Group justify="space-between" mt="md">
        <div>
          <Text fz="xl" span fw={500} className={classes.price}>
            ₹{data.price}
          </Text>
        </div>

        <Button radius="md">Buy now</Button>
      </Group>
    </Card>
  );
}
