import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  const user = await getUserById({ userId });



  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <Question userId={user?.id!} />
      </div>
    </div>
  );
}
