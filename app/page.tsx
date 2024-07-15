"use client";
import { useState, useEffect } from "react";
import { CardsCarousel } from "@/components/Home Page/CardsCarousel";
import Category from "@/components/Home Page/Category";
import { Loader } from "@mantine/core";
import "./page.css";

// Define the type for a single category item
interface CategoryItem {
  _id: string;
  name: string;
  image: {
    male: string;
    female: string;
  };
}

// Define the type for gender-specific category items
interface GenderSpecificCategoryItem {
  id: string;
  name: string;
  image: string;
}

export default function Home() {
  const [menCategories, setMenCategories] = useState<
    GenderSpecificCategoryItem[]
  >([]);
  const [womenCategories, setWomenCategories] = useState<
    GenderSpecificCategoryItem[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/porduct/category";
      console.log("Fetching from URL:", url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CategoryItem[] = await response.json();
        console.log("Fetched data:", data);

        // Separate data for men and women
        const men = data.map((item) => ({
          id: item._id,
          name: item.name,
          image: item.image.male,
        }));
        const women = data.map((item) => ({
          id: item._id,
          name: item.name,
          image: item.image.female,
        }));

        setMenCategories(men); // Update the state with men's data
        setWomenCategories(women); // Update the state with women's data
      } catch (error) {
        console.error("Error fetching the API:", error);
      }
    };

    fetchData();
  }, []);

  console.log("Men Categories state:", menCategories);
  console.log("Women Categories state:", womenCategories);

  return (
    <>
      {/* <Loader className="loader"  /> */}
      <CardsCarousel />
      <Category title="Men" data={menCategories} gender="male" />
      <Category title="Women" data={womenCategories} gender="female" />
    </>
  );
}
