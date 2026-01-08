import Link from "next/link";
import React from "react";
import Image from "next/image";
import Tag from "./Tag";
import { getTopQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";



const RightSidebar = async () => {

  const topQuestions = await getTopQuestions()
  const popularTags = await getPopularTags()

  return (
    <section className="background-light900_dark200 light-border sticky right-0 top-0 flex h-screen flex-col  overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px] custom-scrollbar">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex flex-col w-full gap-[30px]">
          {topQuestions?.map((question) => (
            <Link
              href={`/question/${question.id}`}
              key={question.id}
              className="flex  cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-meduim text-dark500_light700">
                {question.title}
                <Image
                  src={"/assets/icons/chevron-right.svg"}
                  width={20}
                  height={20}
                  alt="right-arrow"
                  className="invert-colors"
                />
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <Tag
              key={tag.id}
              id={tag.id}
              name={tag.name}
              totalQuestions={Number(tag._count)}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
