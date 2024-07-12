"use client";
import { useState, useEffect, Suspense } from "react";
import {
  Button,
  Container,
  TextInput,
  Group,
  Loader,
  Title,
} from "@mantine/core";
import classes from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";

type Address = {
  _id?: string;
  name: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

const AddressForm: React.FC = () => {
  const [formValues, setFormValues] = useState<Address>({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsObjectAlt = Object.fromEntries(searchParams.entries());
  const paramsString = JSON.stringify(paramsObjectAlt);

  useEffect(() => {
    const fetchAddress = async () => {
      if (paramsObjectAlt.id) {
        setLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/address/${paramsObjectAlt.id}`,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          const data = await response.json();
          setFormValues(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching address:", error);
          setLoading(false);
        }
      }
    };

    fetchAddress();
  }, [paramsString]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const method = paramsObjectAlt.id ? "PUT" : "POST";
      const url = paramsObjectAlt.id
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/address/${paramsObjectAlt.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/address`;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setLoading(false);
      router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
    }
  };

  return (
    <Container className={classes.formContainer}>
      <Title order={3}>
        {paramsObjectAlt.id ? "Edit Address" : "Add New Address"}
      </Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          required
        />
        <TextInput
          label="Phone Number"
          name="phoneNumber"
          value={formValues.phoneNumber}
          onChange={handleChange}
          required
        />
        <TextInput
          label="Street"
          name="street"
          value={formValues.street}
          onChange={handleChange}
          required
        />
        <TextInput
          label="City"
          name="city"
          value={formValues.city}
          onChange={handleChange}
          required
        />
        <TextInput
          label="State"
          name="state"
          value={formValues.state}
          onChange={handleChange}
          required
        />
        <TextInput
          label="Country"
          name="country"
          value={formValues.country}
          onChange={handleChange}
          required
        />
        <TextInput
          label="Postal Code"
          name="postalCode"
          value={formValues.postalCode}
          onChange={handleChange}
          required
        />
        <Group mt="md">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader size="xs" />
            ) : paramsObjectAlt.id ? (
              "Update Address"
            ) : (
              "Add Address"
            )}
          </Button>
        </Group>
      </form>
    </Container>
  );
};

const WrappedAddressForm: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <AddressForm />
  </Suspense>
);

export default WrappedAddressForm;
