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
import classes from "./AuthenticationTitle.module.css";
import Link from "next/link";

interface FormValues {
  email: string;
}

export default function forgetPassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<FormValues>({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      console.log(data);
      if (response.ok) {
        console.log(data.message == "Password reset link sent to your email");
        console.log(data.message === "Password reset link sent to your email");

        if (data.message == "Password reset link sent to your email") {
          setMessage("Password reset link successfully sent to your email");
          setTimeout(() => {
            window.location.href = "/user/login";
          }, 2000);
        } else {
          setMessage(data.error || "Sending login link failed");
          setLoading(false);
        }
      } else {
        setMessage(data.message || "Login failed");
        setLoading(false);
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
        Forget Password
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account? <Link href={"/user/login"}>Log In</Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            mt="md"
            {...form.getInputProps("email")}
          />

          <Button type="submit" fullWidth mt="xl" disabled={loading}>
            {loading ? "Sending Loggin Link..." : "Send Login Link"}
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
