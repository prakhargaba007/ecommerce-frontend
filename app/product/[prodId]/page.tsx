"use client";
import { FaqSimple } from "@/components/product components/FaqSimple";
import SuperHeader from "@/components/product components/superHeader";
import { useEffect, useState } from "react";

export default function page({ params }) {
  console.log(params.prodId);

  const [data, setData] = useState({});
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/porduct/${params.prodId}`
      );
      const data = await response.json();
      setData(data);
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
