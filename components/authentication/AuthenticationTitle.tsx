"use client";
import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Notification,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "./AuthenticationTitle.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface OtpFormValues {
  otp: string;
}

export function AuthenticationTitle() {
  const [loading, setLoading] = useState(false);
  const [otpState, setOtpState] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [value, setValue] = useState({});
  const router = useRouter();

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must have at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });
  const otpForm = useForm<OtpFormValues>({
    initialValues: {
      otp: "",
    },

    validate: {
      otp: (value) =>
        value.length !== 6 ? "OTP must have at least 6 values" : null,
    },
  });

  const handleSubmit = async (values: OtpFormValues) => {
    // setLoading(true);
    setMessage("");

    console.log(otp);
    console.log(values.otp);
    // console.log(values.otp !== otp);
    // console.log(values.otp != otp);

    if (values.otp != otp) {
      console.log();

      return setMessage("Write correct otp");
    }
    try {
      console.log("hello");

      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        }
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        if (data.userId) {
          setMessage("Sign up successful!");
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        }
      } else {
        setMessage(data.message || "Sign up failed. Please try again.");
        setTimeout(() => {
          setOtpState(false);
        }, 2000);
      }
    } catch (error) {
      setMessage("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (values: FormValues) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        if (data.otp) {
          setMessage("OTP sent Successfuly");
          setValue({
            name: values.name,
            email: values.email,
            password: values.password,
          });
          setOtpState(true);
          setOtp(data.otp);
        }
      } else {
        setMessage("Send to fail OTP. Please try again.");
      }
    } catch (error) {
      setMessage("Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signUp = (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account? <Link href="/user/login">Log In</Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => handleOtpSubmit(values))}>
          <TextInput
            label="Name"
            placeholder="Your name"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            mt="md"
            {...form.getInputProps("email")}
          />
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
          <Button type="submit" fullWidth mt="xl" disabled={loading}>
            {loading ? "Sending OTP..." : "Sent OTP"}
          </Button>
          {message && (
            <Notification
              mt="md"
              color={message.includes("successful") ? "teal" : "red"}
            >
              {message}
            </Notification>
          )}
        </form>
      </Paper>
    </Container>
  );

  const OTP = (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={otpForm.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="Enter OTP"
            placeholder="Enter OTP sent to your email"
            required
            {...otpForm.getInputProps("otp")}
          />
          <Button type="submit" fullWidth mt="xl" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP and Signup"}
          </Button>
          {message && (
            <Notification
              mt="md"
              color={message.includes("successful") ? "teal" : "red"}
            >
              {message}
            </Notification>
          )}
        </form>
      </Paper>
    </Container>
  );

  return (
    <>
      {!otpState && signUp}
      {otpState && OTP}
    </>
  );
}
