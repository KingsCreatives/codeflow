'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QuestionsSchema } from '@/lib/validations';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { createQuestion, editQuestion } from '@/lib/actions/question.action';
import { useTheme } from '@/context/ThemeProvider';

interface Props {
  type?: string;
  userId: string;
  questionDetails?: string;
  tags?: [{ name: string }];
}

const Question = ({ type, userId, questionDetails }: Props) => {
  const { theme } = useTheme();

  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [isSubmitting, setIsSubmiting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const parsed = JSON.parse(questionDetails!);

  const parsedQuestion = parsed.question;

  const parsedQuestionTags =
    parsedQuestion?.tags?.map((tag: { name: string }) => tag.name) ?? [];

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: '',
      explanation: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (type !== 'Edit' || !parsedQuestion) return;

    form.reset({
      title: parsedQuestion.title ?? '',
      explanation: parsedQuestion.content ?? '',
      tags: parsedQuestion.tags?.map((tag: { name: string }) => tag.name) ?? [],
    });
  }, [type, parsedQuestion?.id]);

  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmiting(true);
    try {
      if (type === 'Edit') {
        await editQuestion({
          questionId: parsedQuestion.id,
          title: values.title,
          content: values.explanation,
          path: pathname,
        });
        router.push(`/question/${parsedQuestion.id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: userId,
          path: pathname,
        });
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating question:', error);
    } finally {
      setIsSubmiting(false);
    }
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;

      const tag = tagInput.value.trim();

      if (tag !== '') {
        if (tag.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message: 'Tag must be less than 15 characters',
          });
        }

        if (!field.value.includes(tag as never)) {
          form.setValue('tags', [...field.value, tag]);
          tagInput.value = '';
          form.clearErrors('tags');
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue('tags', newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-10'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Question Title <span className='text-primary500'>*</span>
              </FormLabel>
              <FormControl className='mt-3.5'>
                <Input
                  className='no-focus paragraph-regule background-light900_dark300 light-border-2 text-dark300_light700 min-h-14 border'
                  {...field}
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light500'>
                Be specific and imagine you're asking a question to another
                person
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='explanation'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Detailed explanation of your problem{' '}
                <span className='text-primary500'>*</span>
              </FormLabel>
              <FormControl className='mt-3.5'>
                <Editor
                  key={theme}
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(_evt, editor) => {
                    editorRef.current = editor;
                  }}
                  initialValue={parsedQuestion.content}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      'wordcount',
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'codesample',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                      'code',
                      'help',
                      'autosave',
                    ],
                    toolbar:
                      'undo redo | blocks | ' +
                      'codesample | bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style:
                      'body { font-family:Inter,; font-size:16px }',
                    skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                    content_css: theme === 'dark' ? 'dark' : 'light',
                  }}
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light500'>
                Introduce the problem and expand on what you put in the title
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Tags <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl className='mt-3.5'>
                <>
                  <Input
                    disabled={type === 'Edit'}
                    className='no-focus paragraph-regule background-light900_dark300 light-border-2 text-dark300_light700 min-h-14 border'
                    placeholder='Add tags...'
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className='flex-start mt-2.5 gap-2.5'>
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className='subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize'
                          onClick={() =>
                            type !== 'Edit'
                              ? handleTagRemove(tag, field)
                              : () => {}
                          }
                        >
                          {tag}
                          {type !== 'Edit' && (
                            <Image
                              src={'/assets/icons/close.svg'}
                              alt='close icon'
                              width={12}
                              height={12}
                              className='cursor-pointer object-contain invert-0 dark:invert'
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light500'>
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='primary-gradient w-fit text-light-900'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === 'Edit' ? 'Editing...' : 'Posting...'}</>
          ) : (
            <>{type === 'Edit' ? 'Edit Question' : 'Ask a Question'}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
