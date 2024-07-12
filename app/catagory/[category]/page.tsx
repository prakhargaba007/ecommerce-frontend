"use client";
import { CarouselCard } from "@/components/product components/CarouselCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import classes from "./page.module.css";

interface Params {
  params: {
    category: string;
  };
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  [key: string]: any; // Add any other fields as needed
}

export default function A({ params }: Params) {
  const [data, setData] = useState<ProductData[]>([]);
  const { category } = params;

  const searchParams = useSearchParams();
  const paramsObjectAlt = Object.fromEntries(searchParams.entries());
  const paramsString = JSON.stringify(paramsObjectAlt); // Stringify the query parameters

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL +
            `/product/category/${category}?${new URLSearchParams(
              paramsObjectAlt
            )}` // Adjusted URL structure
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ProductData[] = await response.json();
        setData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [category, paramsString]); // Use the stringified version as a dependency
  console.log(data.length);

  return (
    <>
      <h1>Category: {category}</h1>
      <div className={classes.card}>
        {data.length === 0 ? (
          <h2>No products available in this category</h2>
        ) : (
          data.map((item) => <CarouselCard key={item._id} data={item} />)
        )}
      </div>
    </>
  );
}
