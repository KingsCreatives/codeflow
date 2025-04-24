"use client";
import { HomePageFilters } from "@/constants/filters";
import React from "react";
import { Button } from "@/components/ui/button";

const HomeFilters = () => {
  const active = "frequent";
  return (
    <div className="mt-10 flex-wrap gap-3 hidden md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {}}
          className={`text-dark400_light700 background-light800_dark300 body-medium rounded-lg px-6 py-4 capitalize shadow-none transition-transform duration-150 hover:scale-105 cursor-pointer ${
            active === item.value
              ? "!bg-orange-400 !text-zinc-50 dark:!bg-orange-500"
              : "!text-light-500"
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
