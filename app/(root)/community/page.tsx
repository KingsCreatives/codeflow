import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";
import UserCard from "@/components/cards/UserCard";

const Page = async () => {
  const result = await getAllUsers({});
 
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/community"
          placeholder="Find a user"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-">
        {result && result.users && result.users.length > 0 ? (
          result.users.map((user) => (
            <UserCard key={user.id} user={user}/>
          ))
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p className="mb-3">No users found</p>
            <Link
              href="/sign-up"
              className="font-bold text-blue-400 cursor-pointer"
            >
              Join our community
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
