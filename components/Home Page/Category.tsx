import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { Title, Image, Box } from "@mantine/core";
import classes from "./Category.module.css";
import Link from "next/link";

interface CategoryProps {
  title: string;
  gender: string;
  data: {
    id: string;
    name: string;
    image: string;
  }[];
}

export default function Category({ title, data, gender }: CategoryProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className={classes.category}>
      <Title order={3} className={classes.title}>
        {title}
      </Title>
      <Carousel
        withIndicators={false}
        withControls={true}
        dragFree
        slideSize={{ base: "40%", sm: "25%", md: "20%" }}
        slideGap="lg"
        align="start"
        controlSize={36}
        loop
        styles={{
          control: {
            background: "rgba(255,255,255,0.9)",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            color: "#111",
            opacity: 1,
            "&:hover": {
              background: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        {data.map((item) => (
          <Carousel.Slide key={item.id}>
            <Link href={`/catagory/${item.name}?gender=${gender}&page=1`} className={classes.cardLink}>
              <Box className={classes.card}>
                <div className={classes.imageWrapper}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      className={classes.image}
                    />
                  ) : (
                    <div className={classes.placeholder}>
                      <span>{item.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <Title order={4} className={classes.itemName}>
                  {item.name}
                </Title>
              </Box>
            </Link>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
}
