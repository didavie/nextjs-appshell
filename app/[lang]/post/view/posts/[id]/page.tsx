"use client";

import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { BlogCollectionRef } from "@/models/models";
import { Locale } from "i18n-config";
import { Post } from "@/types/interfaces";
import { Box, Text } from "@chakra-ui/react";
import remarkHtml from "remark-html";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { remark } from "remark";

import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkFlexibleToc from "remark-flexible-toc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import AhiLoading from "@/components/loading";
import { useEffect, useState } from "react";
import useAppRouter from "@/hooks/useAppRouter";

const Page = async ({
  params: { lang, id },
}: {
  params: { lang: Locale; id: string };
}) => {
  const firestore = useFirestore();
  const d = doc(firestore, BlogCollectionRef, id as string);
  const { status, data: post } = useFirestoreDocData<Post>(d, {
    idField: "id",
  });
  const [ago, setAgo] = useState<string>("");
  const router = useAppRouter();

  useEffect(() => {
    if (!post || !post.createdAt || status !== "success") {
      return;
    }
    const now = new Date();
    const created = new Date(post?.createdAt || 0);
    const diff = now.getTime() - created.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    if (days > 0) {
      setAgo(`${days} days ago`);
    } else if (hours > 0) {
      setAgo(`${hours} hours ago`);
    } else if (minutes > 0) {
      setAgo(`${minutes} minutes ago`);
    } else {
      setAgo(`${seconds} seconds ago`);
    }
  }, [post, status]);
  const toc: any = [];

  if (status === "loading") {
    return <AhiLoading />;
  }
  if (!post) {
    return null;
  }
  if (status === "error") {
    return null;
  }
  if (post.translated?.content[lang] !== undefined)
    await remark()
      .use(gfm)
      .use(remarkFlexibleToc, { tocRef: toc })
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(
        (post.translated?.content[lang] || post.data?.content) as string
      );

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="left"
      width="100%"
      minH={"100vh"}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="top"
        width="100%"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="left"
          width="100%"
        >
          <Text fontSize="2xl" fontWeight={700}>
            {post.translated?.title[lang] || post.data?.title}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {ago} by{" "}
            <span
              style={{ color: "blue" }}
              onClick={() => {
                router.push(`/${lang}/user/view/${post.author?.id}`);
              }}
            >
              {post.author?.name}
            </span>
          </Text>
          <Markdown
            remarkPlugins={[gfm, remarkMath, remarkHtml]}
            rehypePlugins={[rehypeKatex]}
            components={{
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
              // add styles to h1, h2, h3, h4, h5, h6
              h1: (props) => <Text />,
              h2: (props) => (
                <Text fontSize="xl" {...props} mt={4} fontWeight={600} ml={1} />
              ),
              h3: (props) => (
                <Text fontSize="lg" {...props} mt={4} fontWeight={500} ml={2} />
              ),
              h4: (props) => (
                <Text fontSize="md" {...props} mt={4} fontWeight={400} ml={4} />
              ),
              h5: (props) => (
                <Text fontSize="sm" {...props} mt={4} fontWeight={300} ml={6} />
              ),
              h6: (props) => (
                <Text fontSize="xs" {...props} mt={4} fontWeight={200} ml={8} />
              ),

              // add styles to p
              p: (props) => <Text fontSize="md" {...props} mt={2} />,

              // add styles to a
              a: (props) => <a {...props} style={{ color: "blue" }} />,

              // add styles to img
              img: (props) => <img {...props} style={{ maxWidth: "100%" }} />,

              // add styles to table
              table: (props) => (
                <Box overflowX="auto">
                  <table {...props} />
                </Box>
              ),

              // add styles to blockquote
              // blockquote: (props) => (
              //   <Box
              //     borderLeft="4px solid"
              //     borderColor="gray.300"
              //     pl={2}
              //     py={1}
              //     my={2}
              //     {...props}
              //   />
              // ),
            }}
          >
            {post.translated?.content[lang] || post.data?.content}
          </Markdown>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
