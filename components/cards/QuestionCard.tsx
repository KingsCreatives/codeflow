import Link from "next/link";
import React from "react";
import Tag from "../shared/Tag";
import Metric from "../shared/Metric";
import { getTimeStamp } from "@/lib/utils";

interface QuestionProps {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; name: string; picture: string };
  answers: Array<object>;
  views: string | number;
  upvotes: string | number;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  views,
  author,
  answers,
  upvotes,
  createdAt,
}: QuestionProps) => {
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px] ">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>

          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* if signed in add edit delete actions */}
      </div>
      {/* Tags */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl="/assets/icons/avatar.svg"
          alt="user"
          value={author.name}
          title={`- asked ${getTimeStamp(createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          href={`/profiles/${author._id}`}
          isAuthor
        />

        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="upvotes"
          value={upvotes}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
          isAuthor={false}
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={answers.length}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
          isAuthor={false}
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="views"
          value={views}
          title="Views"
          textStyles="small-medium text-dark400_light800"
          isAuthor={false}
        />
      </div>
    </div>
  );
};

export default QuestionCard;
