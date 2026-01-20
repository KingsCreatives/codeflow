import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import Profile from '@/components/forms/Profile';
import { redirect } from 'next/navigation';

const Page = async ({ params }: ParamsProps) => {
  const { id } = await params;

  const { userId } = await auth();

  if (!userId) return null;

  const user = await getUserById({ userId: id });

  if (!user) {
    redirect('/');
  }

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Edit Profile</h1>
      <div className='mt-9'>
        <Profile
          clerkId={userId}
          user={{
            name: user.name,
            username: user.username,
            bio: user.bio,
            location: user.location,
            portfolioWebsite: user.portfolioWebsite,
          }}
        />
      </div>
    </>
  );
};

export default Page;
