"use client";
import React, { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Notification,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "../AuthenticationTitle.module.css";
import Link from "next/link";

interface FormValues {
  password: string;
  confirmPassword: string;
}

interface AuthenticationTitleProps {
  params: {
    userId: string;
  };
}

export default function AuthenticationTitlee({
  params,
}: AuthenticationTitleProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  console.log(params);

  const form = useForm<FormValues>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value) =>
        value.length < 6 ? "Password must have at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: values.password,
            userId: params.userId,
          }),
        }
      );

      const data = await response.json();

      console.log(data);
      if (response.ok) {
        if (data.message == "Password has been reset successfully") {
          // Store the token and user ID in local storage
          setMessage("Password changed successfully!");
          setTimeout(() => {
            window.location.href = "/user/login";
          }, 2000);
        } else {
          setMessage(data.message || "Login failed");
        }
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account? <Link href="/user/signup">Log In</Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            {...form.getInputProps("confirmPassword")}
          />
          <Group mt="lg">
            <Link href={"/user/forgetPassword"}>Forgot password?</Link>
          </Group>

          <Button type="submit" fullWidth mt="xl" disabled={loading}>
            {loading ? "Logging in..." : "Change  Password"}
          </Button>
          {message && (
            <Notification
              mt="md"
              onClose={() => setMessage(null)}
              color={message.includes("successful") ? "teal" : "red"}
            >
              {message}
            </Notification>
          )}
        </form>
      </Paper>
    </Container>
  );
}
