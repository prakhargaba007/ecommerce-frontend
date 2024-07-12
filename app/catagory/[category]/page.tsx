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

export default function A({ params }: Params) {
  const [data, setData] = useState([]);
  const { category } = params;

  const searchParams = useSearchParams();
  const paramsObjectAlt = Object.fromEntries(searchParams.entries());
  const paramsString = JSON.stringify(paramsObjectAlt); // Stringify the query parameters

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL +
            `/porduct/category/${category}?${new URLSearchParams(
              paramsObjectAlt
            )}` // Adjusted URL structure
        );
        const data = await response.json();
        setData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [category, paramsString]); // Use the stringified version as a dependency
  console.log(data.length);

  return (
    <>
      <h1>Category: {category}</h1>
      <div className={classes.card}>
        {data.length === 0 || data.length === undefined ? (
          <h2>New product available with this category</h2>
        ) : (
          data.map((item) => <CarouselCard key={item._id} data={item} />)
        )}
      </div>
    </>
  );
}
