"use client";
import { useEffect, useState } from "react";
import { Title, Text, Button, Avatar, Notification } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import Link from "next/link";
import classes from "./page.module.css";

interface Profile {
  twoFactorAuth: {
    enabled: boolean;
  };
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  dateJoined: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  address: string[];
  cart: string[];
  discount: string[];
  order: string[];
  payment: string[];
  review: string[];
  wishlist: string[];
  products: string[];
}

interface Notification {
  message: string;
  color: "red" | "green";
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

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

  if (!profile) {
    return <Text>Loading...</Text>;
  }

  return (
    <div className={classes.profileContainer}>
      <Title order={2}>Profile</Title>
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
      <div className={classes.profileInfo}>
        <Avatar size="xl" color="blue">
          {profile.name[0].toUpperCase()}
        </Avatar>
        <div className={classes.details}>
          <Text>Name: {profile.name}</Text>
          <Text>Email: {profile.email}</Text>
          <Text>Role: {profile.role}</Text>
          <Text>
            Date Joined: {new Date(profile.dateJoined).toLocaleDateString()}
          </Text>
        </div>
      </div>
      <div className={classes.actions}>
        <Link href={`/user/profile/edit-profile`}>
          <Button className={classes.button}>Edit Details</Button>
        </Link>
        <Link href={`/user/profile/change-password`}>
          <Button className={classes.button}>Change Password</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
