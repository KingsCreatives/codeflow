import Link from "next/link";
import React from "react";
import Image from "next/image";
import Tag from "./Tag";
const topQuestions = [
  {
    id: "1",
    title:
      "How to Ensure Unique User Profile with ON CONFLICT in PostgreSQL Using Drizzle ORM?",
  },
  {
    id: "2",
    title:
      "What are the benefits and trade-offs of using Server-Side Rendering (SSR) in Next.js?",
  },
  {
    id: "3",
    title: "How to center a div?",
  },
  {
    id: "4",
    title:
      "Node.js res.json() and res.send(), not working but still able to change status code",
  },
  {
    id: "5",
    title: "ReactJs or NextJs for begginers i ask for advice",
  },
];

const popularTag = [
  { id: "1", name: "javascript", totalQuestion: 5 },
  { id: "2", name: "java", totalQuestion: 8 },
  { id: "3", name: "php", totalQuestion: 2 },
  { id: "4", name: "react", totalQuestion: 85 },
  { id: "5", name: "rust", totalQuestion: 1 },
];

const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border sticky right-0 top-0 flex h-screen flex-col  overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px] custom-scrollbar">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex flex-col w-full gap-[30px]">
          {topQuestions.map((question) => (
            <Link
              href={`/questions/${question.id}`}
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
          {popularTag.map((tag) => (
            <Tag
              key={tag.id}
              id={tag.id}
              name={tag.name}
              totalQuestions={tag.totalQuestion}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
