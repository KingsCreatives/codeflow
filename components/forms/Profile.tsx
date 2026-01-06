'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';

import { ProfileSchema } from '@/lib/validations';
import { usePathname, useRouter } from 'next/navigation';
import { updateUser } from '@/lib/actions/user.action';

interface Props {
  clerkId: string;
  user: {
    name: string;
    username: string;
    bio: string | null;
    location: string | null;
    portfolioWebsite: string | null;
  };
}

const Profile = ({ clerkId, user }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name ?? '',
      username: user.username ?? '',
      bio: user.bio ?? '',
      portfolioWebsite: user.portfolioWebsite ?? '',
      location: user.location ?? '',
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true);
    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          bio: values.bio || null,
          location: values.location || null,
          portfolioWebsite: values.portfolioWebsite || null,
        },
        path: pathname,
      });
      router.back();
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mt-9 flex flex-col w-full'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>
                name <span className='text-primary500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='name'
                  {...field}
                  className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-14'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>
                username <span className='text-primary500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='your username'
                  {...field}
                  className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-14'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='portfolioWebsite'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Porfolio URL</FormLabel>
              <FormControl>
                <Input
                  type='url'
                  placeholder='Portfolio URL'
                  {...field}
                  className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-14'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>location</FormLabel>
              <FormControl>
                <Input
                  placeholder='Your location'
                  {...field}
                  className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-14'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='bio'
                  {...field}
                  className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-14'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='mt-7 flex justify-end'>
          <Button
            type='submit'
            className='primary-gradient w-fit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
