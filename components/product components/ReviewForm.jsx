import React, { useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Box,
  Rating,
  Menu,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconDotsVertical } from "@tabler/icons-react";
import styles from "./ReviewForm.module.css";

const ReviewForm = ({ orderId, productId, productReview }) => {
  const [rating, setRating] = useState(productReview?.rating || 0);
  const [comment, setComment] = useState(productReview?.comment || "");
  const [review, setReview] = useState(productReview || {});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("productId", productId);
      formData.append("rating", rating);
      formData.append("comment", comment);
      if (image) {
        console.log("Appending image to formData");
        formData.append("image", image);
      }

      // console.log(...formData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/review`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setReview(data);
      setIsEditing(false);
      showNotification({
        title: "Success",
        message: "Review submitted successfully!",
        color: "green",
      });
    } catch (error) {
      console.error("Failed to submit review:", error);
      showNotification({
        title: "Error",
        message: "Failed to submit review",
        color: "red",
      });
    }
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", comment);
      if (image) {
        console.log("Appending image to formData for edit");
        formData.append("image", image);
      }

      console.log(...formData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/${review._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setReview(data);
      setIsEditing(false);
      showNotification({
        title: "Success",
        message: "Review updated successfully!",
        color: "green",
      });
    } catch (error) {
      console.error("Failed to update review:", error);
      showNotification({
        title: "Error",
        message: "Failed to update review",
        color: "red",
      });
    }
  };

  return (
    <Box className={styles.reviewFormContainer}>
      {(review === null || Object.keys(review).length === 0 || isEditing) && (
        <form
          onSubmit={isEditing ? handleEdit : handleSubmit}
          className={styles.form}
        >
          <Group direction="column" spacing="xs">
            <Rating
              value={rating}
              onChange={setRating}
              label="Rating"
              required
              className={styles.rating}
            />
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              label="Comment"
              required
              className={styles.textarea}
            />
            <TextInput
              type="file"
              onChange={handleImageChange}
              label="Upload Image"
              accept="image/*"
              className={styles.imageInput}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className={styles.imagePreview}
              />
            )}
            <Button type="submit" className={styles.submitButton}>
              {isEditing ? "Update Review" : "Submit Review"}
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              className={styles.cancelButton}
            >
              Cancel
            </Button>
          </Group>
        </form>
      )}
      {review !== null && Object.keys(review).length > 0 && !isEditing && (
        <Box className={styles.reviewBox}>
          <Group position="apart" className={styles.reviewOption}>
            <div>
              <Rating
                value={review.rating}
                readOnly
                className={styles.rating}
              />
              <p className={styles.comment}>{review.comment}</p>
              {review.image && (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${review.image}`}
                  alt="Review"
                  className={styles.reviewImage}
                />
              )}
            </div>
            <Menu>
              <Menu.Target className={styles.dots}>
                <IconDotsVertical size={16} />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => {
                    setIsEditing(true);
                    setRating(review.rating);
                    setComment(review.comment);
                    setImagePreview(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/${review.image}`
                    );
                  }}
                >
                  Edit
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Box>
      )}
    </Box>
  );
};

export default ReviewForm;
