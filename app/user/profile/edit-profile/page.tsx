"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Button, Notification } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import classes from "./page.module.css";

interface Profile {
  name: string;
  email: string;
}

interface Notification {
  message: string;
  color: "red" | "green";
}

const EditProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notification, setNotification] = useState<Notification | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setNotification({
          message: "Error fetching profile data",
          color: "red",
        });
        setTimeout(() => {
          setNotification(null);
        }, 1500);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ name, email }),
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        setNotification({
          message: "Profile updated successfully",
          color: "green",
        });
        setTimeout(() => {
          router.back();
          setNotification(null);
        }, 1500);
      } else {
        setNotification({
          message: "Failed to update profile",
          color: "red",
        });
        setTimeout(() => {
          setNotification(null);
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        message: "Error updating profile",
        color: "red",
      });
      setTimeout(() => {
        setNotification(null);
      }, 1500);
    }
  };

  return (
    <div className={classes.editProfileContainer}>
      <TextInput
        label="Name"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        className={classes.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        className={classes.input}
      />
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
      <Button onClick={handleSave} className={classes.button}>
        Save Changes
      </Button>
    </div>
  );
};

export default EditProfilePage;
