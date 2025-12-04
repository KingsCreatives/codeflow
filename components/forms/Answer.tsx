"use client";
import React, { useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnswerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface AnswerProps{
  question : string,
  authorId : string,
  questionId: string
}

const type: any = 'create';


const Answer = ({ authorId, question, questionId } : AnswerProps) => {
  const path = usePathname()
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [isSubmitting, setIsSubmiting] = useState(false);

  const { theme } = useTheme();
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async(values: z.infer<typeof AnswerSchema>) => {
     setIsSubmiting(true);
     try {
       const result = await createAnswer({
         content: values.answer,
         question: questionId,
         author: authorId,
         path : path,
       });

       if(result?.error){
        console.error("Server Error:", result.error)
        return;
       }

       form.reset()
       if(editorRef.current){
         const editor = editorRef.current as  any
         editor.setContent("")
       }
     } catch (error) {
       console.error("Client Error:", error)
     }finally{
        setIsSubmiting(false);
     }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="flex items-center btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary500 shadow-none dark:text-primary-500 max-w-[50vw]"
          onClick={() => {}}
        >
          <Image
            src="/assets/icons/stars.svg"
            alt="star"
            width={12}
            height={12}
            className="object-contain"
          />
          Answer with AI
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full gap-10 flex-col"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    key={theme} // Force re-mount on theme change
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(_evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "wordcount",
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "autosave",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "codesample | bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Inter,; font-size:16px }",
                      skin: theme === "dark" ? "oxide-dark" : "oxide",
                      content_css: theme === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

           <Button
                    type="submit"
                    className="primary-gradient w-fit text-light-900"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>{type === "edit" ? "Editing..." : "Posting..."}</>
                    ) : (
                      <>{type === "edit" ? "Edit Answer" : "Post an Answer"}</>
                    )}
                  </Button>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
