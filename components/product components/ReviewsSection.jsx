import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Group,
  Image,
  Text,
  Button,
  Badge,
  SimpleGrid,
  Modal,
  Box,
} from "@mantine/core";
import styles from "./ReviewsSection.module.css";

const ReviewsSection = ({ product }) => {
  const [allImagesOpened, setAllImagesOpened] = useState(false);
  const router = useRouter();

  const ratings = product.ratings;
  const reviews = product.review;
  const reviewImages = reviews
    .filter((review) => review.image)
    .map((review) => review.image);

  const handleSeeAllReviews = () => {
    router.push({
      pathname: "/all-reviews",
      query: { product: JSON.stringify(product) },
    });
  };

  return (
    <Container className={styles.container}>
      <Text component="h2" className={styles.sectionTitle}>
        Reviews and Rating section
      </Text>
      <Box mb={40}>
        <Text size="lg" weight={500} color="dimmed" mb={20}>
          Rating Distribution
        </Text>
        <div className={styles.ratingsGroup}>
          {Object.keys(ratings).map((star) => (
            <Badge key={star} className={styles.ratingBadge}>
              {star.replace("star", "")} Star: {ratings[star]}
            </Badge>
          ))}
        </div>
      </Box>

      <Text component="h3" className={styles.subSectionTitle}>
        Review Highlights
      </Text>
      <SimpleGrid cols={4} className={styles.imageGrid}>
        {reviewImages.slice(0, 8).map((img, idx) => (
          <div key={idx} className={styles.reviewImage}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`}
              alt={`Review Image ${idx + 1}`}
            />
          </div>
        ))}
      </SimpleGrid>

      {reviewImages.length > 8 && (
        <Button
          onClick={() => setAllImagesOpened(true)}
          className={styles.button}
          variant="outline"
        >
          View All Images
        </Button>
      )}

      <Text component="h3" className={styles.subSectionTitle}>
        Customer Reviews
      </Text>
      {reviews.slice(0, 5).map((review) => (
        <Group
          key={review._id}
          className={styles.reviewItem}
          position="apart"
          noWrap
        >
          <div className={styles.reviewContent}>
            <Text className={styles.reviewerName}>{review.user.name}</Text>
            <Text className={styles.rating}>{"★".repeat(review.rating)}</Text>
            <Text className={styles.comment}>{review.comment}</Text>
          </div>
          {review.image && (
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${review.image}`}
              alt={review.user.name}
              width={150}
              height={150}
              fit="cover"
              className={styles.reviewImageLarge}
            />
          )}
        </Group>
      ))}

      {reviews.length > 5 && (
        <Button onClick={handleSeeAllReviews} className={styles.button}>
          Read All Reviews
        </Button>
      )}

      <Modal
        opened={allImagesOpened}
        onClose={() => setAllImagesOpened(false)}
        title="All Review Images"
        size="xl"
      >
        <SimpleGrid cols={4} className={styles.modalImageGrid}>
          {reviewImages.map((img, idx) => (
            <div key={idx} className={styles.modalReviewImage}>
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`}
                alt={`Review Image ${idx + 1}`}
              />
            </div>
          ))}
        </SimpleGrid>
      </Modal>
    </Container>
  );
};

export default ReviewsSection;
