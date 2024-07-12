"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput, Button, Notification } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import classes from "./page.module.css";

interface Notification {
  message: string;
  color: "red" | "green";
}

const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [notification, setNotification] = useState<Notification | null>(null);
  const router = useRouter();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setNotification({
        message: "New password and confirm password do not match",
        color: "red",
      });
      setTimeout(() => {
        setNotification(null);
      }, 1500);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setNotification({
          message: "Password changed successfully",
          color: "green",
        });
        setTimeout(() => {
          setNotification(null);
          router.back();
        }, 1500);
      } else {
        setNotification({
          message: data.message || "Failed to change password",
          color: "red",
        });
        setTimeout(() => {
          setNotification(null);
        }, 1500);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setNotification({
        message: "Error changing password",
        color: "red",
      });
      setTimeout(() => {
        setNotification(null);
      }, 1500);
    }
  };

  return (
    <div className={classes.changePasswordContainer}>
      <PasswordInput
        label="Current Password"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.currentTarget.value)}
        className={classes.input}
      />
      <PasswordInput
        label="New Password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.currentTarget.value)}
        className={classes.input}
      />
      <PasswordInput
        label="Confirm Password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.currentTarget.value)}
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
      <Button onClick={handleChangePassword} className={classes.button}>
        Change Password
      </Button>
    </div>
  );
};

export default ChangePasswordPage;
