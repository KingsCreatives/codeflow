"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface LocalSearchbarProps {
  route: string;
  placeholder: string;
  imgSrc: string;
  otherClasses?: string;
  iconPosition: string;
}

const LocalSearchbar = ({
  route,
  placeholder,
  imgSrc,
  otherClasses,
  iconPosition,
}: LocalSearchbarProps) => {
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-3 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value=""
        onChange={() => {}}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none outline-none shadow-none flex-grow"
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
