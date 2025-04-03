import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface NoResultProps {
  title: String;
  description: String;
  link: String;
  linkTitle: String;
}

const NoResult = ({ title, description, link, linkTitle }: NoResultProps) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src={"/assets/images/light-illustration.png"}
        alt="no result illustration"
        width={270}
        height={270}
        className="block object-contain dark:hidden"
      />

      <Image
        src={"/assets/images/dark-illustration.png"}
        alt="no result illustration"
        width={270}
        height={270}
        className="hidden object-contain dark:flex"
      />

      <h2 className="h2-bold text-dark200_light900 mt-8 ">
        {title}
      </h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md">
       {description}
      </p>

      <Link href={`${link}`}>
        <Button className="mt-6 min-h-[46px]px-4 py-3 bg-primary-500 text-light900 paragraph-medium dark:bg-primary-500 dark:text-light900">
          {linkTitle}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
