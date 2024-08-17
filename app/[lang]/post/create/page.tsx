"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { use, useEffect, useState } from "react";

import * as commands from "@uiw/react-md-editor/commands";
import { Locale } from "i18n-config";
import { useMediaQuery, Box, Button, Text } from "@chakra-ui/react";
import { Breakpoints } from "@/config/ui";
import { addDoc, query, doc, collection, updateDoc } from "firebase/firestore";
import { BlogCollectionRef } from "@/models/models";
import { useFirestore, useSigninCheck } from "reactfire";
import { Post } from "@/types/interfaces";
import { Types, Categories } from "@/config/constants";
import { MultiSelect, Select } from "@mantine/core";
import { defaultColor } from "@/config/colors";
import useAppRouter from "@/hooks/useAppRouter";
import remarkHtml from "remark-html";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { remark } from "remark";

import gfm from "remark-gfm";
import rehypeStringify from "rehype-stringify";
import remarkFlexibleToc from "remark-flexible-toc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const Page = ({ params: { lang } }: { params: { lang: Locale } }) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [isMobile] = useMediaQuery(`(max-width: ${Breakpoints.sm}px)`);
  const firestore = useFirestore();
  const { status, data: signInCheckResult } = useSigninCheck();
  const [headers, setHeaders] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [categorie, setCategorie] = useState<string | null>("");
  const [types, setTypes] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);
  const router = useAppRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const save = async () => {
    if (value) {
      setIsSaving(true);
      const content_without_description = value.replace(description, "");
      const content_without_tags = tags.reduce(
        (content, tag) => content.replace(`@${tag}`, ""),
        content_without_description
      );

      const content = content_without_tags;
      let headers_keywords: string[] = [];
      headers.forEach((header) => {
        headers_keywords = headers_keywords.concat(header.split(" "));
      });
      const post: Post = {
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: {
          content: content,
          category: categorie as string,
          tags: tags.join(","),
          types: types.join(","),
          description: description,
          keywords: keywords,
          headers: headers,
          title: title,
          searchKeywords: searchKeywords
            .concat(tags)
            .concat(keywords)
            .concat(description.split(" "))
            .concat(headers_keywords)
            .join(","),
        },
        author: {
          id: signInCheckResult?.user?.uid || "",
          name: signInCheckResult?.user?.displayName || "",
          photoURL: signInCheckResult?.user?.photoURL || "",
        },
        likes: 0,
      };
      const st = await addDoc(
        collection(firestore, BlogCollectionRef),
        post
      ).catch((e) => {
        console.error(e);
        return null;
      });
      if (!st) {
        setIsSaving(false);
        return null;
      }
      await updateDoc(doc(firestore, BlogCollectionRef, st.id), {
        id: st.id,
      }).catch((e) => {
        console.error(e);
        return null;
      });
      setPost({
        id: st.id,
        data: {
          ...post.data,
        },
      });
      setIsSaving(false);
      setSaved(true);
    }
  };

  useEffect(() => {
    if (saved) {
      setTags([]);
      setTitle("");
      setValue("");
      setDescription("");
      setTypes([]);
      setCategorie("");
      setHeaders([]);
      setKeywords([]);
      router.push(`/${lang}/post/view/posts/${post?.id}`);
      setSaved(false);
    }
  }, [saved]);

  useEffect(() => {
    if (
      value &&
      value.length > 0 &&
      title &&
      title.length > 0 &&
      categorie &&
      categorie.length > 0 &&
      types.length > 0 &&
      description &&
      description.length > 0
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [value, title, categorie, types, description]);

  useEffect(() => {
    if (status === "success" && !signInCheckResult.signedIn) {
      router.push(`/${lang}/user/login`);
      setIsSaving(false);
    }
  }, [status, signInCheckResult]);

  useEffect(() => {
    if (value) {
      const headers = value.match(/#{1,6} .+/g);
      if (headers) {
        setHeaders(headers.map((header) => header.replace(/#{1,6} /, "")));
      }
    }
  }, [value]);

  useEffect(() => {
    if (value) {
      const keywords = value.match(/#[a-zA-Z0-9]+/g);
      if (keywords) {
        setKeywords(keywords.map((keyword) => keyword.replace("#", "")));
      }
    }
  }, [value]);

  useEffect(() => {
    if (value) {
      const tags = value.match(/@[a-zA-Z0-9]+/g);
      if (tags) {
        setTags(tags.map((tag) => tag.replace("@", "")));
      }
    }
  }, [value]);

  //   description is markdown quote block before first header
  useEffect(() => {
    if (value) {
      const description = value.match(/>.+/);
      if (description) {
        setDescription(description[0].replace(">", ""));
      }
    }
  }, [value]);

  useEffect(() => {
    if (value) {
      const title = value.match(/# .+/);
      if (title) {
        setTitle(title[0].replace("# ", ""));
      }
    }
  }, [value]);

  //   serachKeywords all words in the headers, keywords and tags.
  useEffect(() => {
    if (headers.length > 0) {
      // get all words in the headers
      const headersWords = headers.join(" ").match(/\w+/g);
      if (headersWords) {
        setSearchKeywords(headersWords);
      }
    }
  }, [headers]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      width="100%"
      minHeight="100vh"
      pt={4}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
        width="100%"
        mb={4}
      >
        <Select
          data={Categories}
          value={categorie}
          searchable
          placeholder="Select category"
          label="Category"
          onChange={(value) => setCategorie(value)}
          mr={2}
        />
        <MultiSelect
          data={Types[categorie as string]}
          value={types}
          searchable
          placeholder="Select types"
          label="Types"
          onChange={(value) => setTypes(value)}
          mr={2}
        />
      </Box>
      <Box
        width="100%"
        mb={4}
        display={title && title.length > 0 ? "block" : "none"}
      >
        <Text>Title</Text>
        <Text>{title}</Text>
      </Box>
      <Box
        width="100%"
        mb={4}
        display={description && description.length > 0 ? "block" : "none"}
      >
        <Text>Description</Text>
        <Text>{description}</Text>
      </Box>
      {/* add tags */}
      <Box width="100%" mb={4} display={tags.length > 0 ? "block" : "none"}>
        <Text>Tags</Text>
        <Text>{tags.join(", ")}</Text>
      </Box>
      <MDEditor
        value={value}
        onChange={setValue}
        height={500}
        preview={isMobile ? "edit" : "live"}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.divider,
          commands.title,
          commands.divider,
          commands.link,
          commands.code,
          commands.image,
          commands.divider,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand,
          commands.divider,
          commands.table,
          commands.quote,
          commands.divider,
          commands.title,
          commands.title1,
          commands.title2,
          commands.title3,
          commands.title4,
          commands.title5,
          commands.title6,
          commands.divider,
          commands.issue,
        ]}
        previewOptions={{
          components: {
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  style={atomDark as any}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          },
          rehypePlugins: [rehypeStringify, rehypeKatex],
          remarkPlugins: [gfm, remarkHtml, remarkFlexibleToc, remarkMath],
        }}
      />
      <Button
        onClick={() => {
          save();
        }}
        backgroundColor={defaultColor}
        mt={4}
        isLoading={isSaving}
        isDisabled={isDisabled}
        mb={6}
      >
        Save
      </Button>
    </Box>
  );
};

export default Page;
