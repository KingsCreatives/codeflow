"use client";
import HomeFilters from "@/components/Home/HomeFilters";
import Filter from "@/components/shared/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import Link from "next/link";
import React from "react";
import { formatNumber } from "@/lib/utils";

const questions = [
  {
    _id: "1",
    title: "lorem7",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "sql" },
    ],
    author: { picture: "/imageURl", _id: "101", name: "Jon" },
    upvotes: 10,
    views: 100000000,
    answers: [
      {
        _id: "201",
        author: { picture: "/imageURl", _id: "301", name: "Alice" },
        content: "Use Python ORM libraries like SQLAlchemy.",
      },
      {
        _id: "202",
        author: { picture: "/imageURl", _id: "302", name: "Bob" },
        content: "You can also use Django ORM.",
      },
    ],
    createdAt: new Date("2025-01-15T12:00:00.00Z"),
  },
  {
    _id: "2",
    title: "How to implement authentication in React?",
    tags: [
      { _id: "3", name: "react" },
      { _id: "4", name: "javascript" },
    ],
    author: { picture: "/imageURl", _id: "102", name: "Sarah" },
    upvotes: 15,
    views: 250,
    answers: [
      {
        _id: "203",
        author: { picture: "/imageURl", _id: "303", name: "Charlie" },
        content: "You can use Firebase authentication.",
      },
      {
        _id: "204",
        author: { picture: "/imageURl", _id: "304", name: "David" },
        content: "Consider using JWT and Express for backend authentication.",
      },
    ],
    createdAt: new Date("2023-11-10T14:30:00.00Z"),
  },
  {
    _id: "3",
    title: "Best practices for Docker deployment",
    tags: [
      { _id: "5", name: "docker" },
      { _id: "6", name: "devops" },
    ],
    author: { picture: "/imageURl", _id: "103", name: "Mike" },
    upvotes: 8,
    views: 180,
    answers: [
      {
        _id: "205",
        author: { picture: "/imageURl", _id: "305", name: "Eve" },
        content: "Use multi-stage builds to reduce image size.",
      },
      {
        _id: "206",
        author: { picture: "/imageURl", _id: "306", name: "Frank" },
        content: "Always specify the version of base images.",
      },
    ],
    createdAt: new Date("2024-11-05T09:15:00.00Z"),
  },
  {
    _id: "4",
    title: "Understanding TypeScript Generics",
    tags: [
      { _id: "7", name: "typescript" },
      { _id: "8", name: "javascript" },
    ],
    author: { picture: "/imageURl", _id: "104", name: "Emma" },
    upvotes: 12,
    views: 320,
    answers: [
      {
        _id: "207",
        author: { picture: "/imageURl", _id: "307", name: "Grace" },
        content: "Generics allow reusable components with flexible types.",
      },
      {
        _id: "208",
        author: { picture: "/imageURl", _id: "308", name: "Hank" },
        content: "Use constraints to limit the types generics can accept.",
      },
    ],
    createdAt: new Date("2021-09-04T16:45:00.00Z"),
  },
];

const Home = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h[46px] px-4 py-3 !text-light-900 cursor-pointer">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          placeholder="Search for questions, topics, or tags..."
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags.map((tag) => tag)}
              upvotes={formatNumber(question.upvotes)}
              views={formatNumber(question.views)}
              author={question.author}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="It looks like there aren’t any questions here yet."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Home;
