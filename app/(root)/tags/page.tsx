import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { TagFilters, UserFilters } from "@/constants/filters";
import { getAllTags} from "@/lib/actions/tag.action";
import Link from "next/link";
import NoResult from "@/components/shared/NoResult";


const Page = async () => {
  const result = await getAllTags({});


  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">AllTags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          placeholder="Find a tag"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.id}`}
              className="shadow-light100_darknone md:m-6 flex flex-col w-full md:w-[260px]"
            >
              <article className="flex w-full background-light900_dark200 light-border flex-col rounded-2xl border px-8 py-10">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>

                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questions.length}+ questions
                  </span>
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title={"No tags found"}
            description={"Try adjusting your filters or create a new tag."}
            link={"/ask-question"}
            linkTitle={"Ask a question"}
          />
        )}
      </section>
    </div>
  );
};

export default Page;
