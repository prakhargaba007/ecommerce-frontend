"use client";
import { FaqSimple } from "@/components/product components/FaqSimple";
import SuperHeader from "@/components/product components/superHeader";
import { useEffect, useState } from "react";

type Params = {
  params: {
    prodId: string;
  };
};

type ProductData = {
  // Define the shape of your product data based on your API response
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
  [key: string]: any; // Add any other fields as needed
};

export default function Page({ params }: Params) {
  console.log(params.prodId);

  const [data, setData] = useState<ProductData>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + `/product/${params.prodId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ProductData = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }
    fetchData();
  }, [params.prodId]);

  return (
    <>
      <SuperHeader data={data} />
      <FaqSimple />
    </>
  );
}
