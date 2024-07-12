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
  return (
    <div className={classes.category}>
      <Title className={classes.title} order={2}>
        {title}
      </Title>
      <Carousel
        withIndicators={false}
        withControls={false}
        dragFree
        height={250}
        slideSize="auto"
        slideGap="md"
        align={"start"}
        className={classes.carousel}
      >
        {data.map((item) => (
          <Link
            key={item.id}
            href={`/catagory/${item.name}?gender=${gender}&page=1`}
          >
            <Carousel.Slide>
              <Box className={classes.slideBox}>
                <div className={classes.imageCircle}>
                  <Image src={item.image} alt="Category Image" fit="cover" />
                </div>
                <Title order={3} className={classes.categoryName}>
                  {item.name}
                </Title>
              </Box>
            </Carousel.Slide>
          </Link>
        ))}
      </Carousel>
    </div>
  );
}
