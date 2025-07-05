import React from 'react';
import { getUserInfo } from '@/lib/actions/user.action';
import { URLProps } from '@/types';
import { SignIn, SignedIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getJoinedDate } from '@/lib/utils';
import ProfileLink from '@/components/shared/ProfileLink';

const Page = async ({ params, searchParams }: URLProps) => {
  const userInfo = await getUserInfo({ userId: params.id });

  const { userId: clerkId } = await auth();

  return (
    <>
      <div className='flex flex-col-reverse item-start justify-between sm:flex-row'>
        <div className='flex flex-col items-start lg:flex-row gap-4'>
          <Image
            src={userInfo?.picture}
            alt={userInfo?.name || 'User Profile'}
            width={140}
            height={140}
            className='rounded-full object-cover'
          />
          <div className='mt-3'>
            <h2 className='h2-bold text-dark100_light900'>{userInfo?.name}</h2>
            <p className='paragraph-regular text-dark200_light800'>
              @{userInfo?.username}
            </p>
            <div className='mt-5 flex flex-wrap items-center justify-start gap-5'>
              {userInfo?.portfolioWebsite && (
                <ProfileLink
                  imageUrl='/assets/icons/link.svg'
                  href={userInfo?.portfolioWebsite}
                  title='Portfolio '
                />
              )}
              {userInfo?.location && (
                <ProfileLink
                  imageUrl='/assets/icons/location.svg'
                  title={userInfo?.location}
                />
              )}
              <ProfileLink
                imageUrl='/assets/icons/calendar.svg'
                title={getJoinedDate(userInfo.joinedAt)}
              />
              <p className='paragraph-regular text-dark400_light800 mt-8'>{userInfo?.bio}</p>
            </div>
          </div>
        </div>
        <div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
          <SignedIn>
            {clerkId === userInfo.clerkId && (
              <Link href={`/profile/edit`}>
                <Button className='cursor pointer px-4 py-3 min-w-[175px] min-h-[46px]'>
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      Stats
      <div className='mt-10 flex gap-10'>
        <Tabs defaultValue='top-posts' className='flex-1'>
          <TabsList className='background-light800_dark400'>
            <TabsTrigger value='top-posts' className='tab'>
              Top post
            </TabsTrigger>
            <TabsTrigger value='answers' className='tab'>
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value='top-posts'>POST</TabsContent>
          <TabsContent value='answers'>ANSWERS</TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
