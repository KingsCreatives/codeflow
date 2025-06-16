import { getQuestionById } from "@/lib/actions/question.action";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Metric from "@/components/shared/Metric";
import { getTimeStamp } from "@/lib/utils";
import ParsedContent from "@/components/shared/ParsedContent";
import Tag from "@/components/shared/Tag";
import Answer from "@/components/forms/Answer";

interface PageProps {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

const page = async ({ params, searchParams }: PageProps) => {
  const result = await getQuestionById({
    questionId: params.id,
  });

  return (
    <>
      <div>
        <div className="flex-start w-full flex-col">
          <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
            <Link
              href={`/profile/${result.question?.author.clerkId}`}
              className="flex items-center justify-start gap-1"
            >
              <Image
                src={
                  result.question?.author.picture || "/assets/images/avatar.png"
                }
                alt="back"
                width={24}
                height={24}
                className="cursor-pointer rounded-full"
              />
              <p className="paragraph-semibold text-dark300_light700">
                {result.question?.author.name}
              </p>
            </Link>

            <div className="flex justify-end">Voting</div>
          </div>

          <h2 className="w-full text-left h2-semibold text-dark200_light900 mt-3.5">
            {result.question?.title}
          </h2>
        </div>

        <div className="mb-8 mt-5 flex flex-wrap gap-4">
          <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="clock icon"
            value={`asked ${getTimeStamp(result.question?.createdAt ?? "")}`}
            title="Asked"
            textStyles="small-medium text-dark400_light800"
            isAuthor={false}
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="answers"
            value={result.question?.answers.length || 0}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
            isAuthor={false}
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="views"
            value={result.question?.views || 0}
            title="Views"
            textStyles="small-medium text-dark400_light800"
            isAuthor={false}
          />
        </div>

        <ParsedContent data={result.question?.content ?? ""} />

        <div>
          {result.question?.tags && result.question.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4">
              {result.question.tags.map((tag) => (
                <Tag
                  key={tag.id}
                  id={tag.id}
                  name={tag.name}
                  showCount={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Answer />
    </>
  );
};

export default page;
