"use client";
import { FaqSimple } from "@/components/product components/FaqSimple";
import ReviewsSection from "../../../components/product components/ReviewsSection";
import SuperHeader from "@/components/product components/superHeader";
import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";

type Params = {
  params: {
    prodId: string;
  };
};

type ProductData = {
  _id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  color: string;
  fabric: string;
  gender: string;
  stock: number;
  images: string[];
  [key: string]: any; // Add any other fields as needed
};

export default function Page({ params }: Params) {
  console.log(params.prodId);

  const [data, setData] = useState<ProductData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + `/porduct/${params.prodId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const productData: ProductData = await response.json();
        setData(productData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }
    fetchData();
  }, [params.prodId]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SuperHeader data={data} />
      <FaqSimple />
      <ReviewsSection product={data} />
    </>
  );
}
