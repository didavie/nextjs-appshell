"use client";

import { doc, query } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { ResumeCollectionRef } from "@/models/models";
import { Locale } from "i18n-config";
import { Resume, User } from "@/types/interfaces";
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
  const d = doc(firestore, ResumeCollectionRef, id as string);
  const { status, data: resume } = useFirestoreDocData<Resume>(d, {
    idField: "id",
  });
  const [ago, setAgo] = useState<string>("");
  const router = useAppRouter();

  const toc: any = [];

  if (status === "loading") {
    return <AhiLoading />;
  }
  if (!resume) {
    return <Text>Resume not found</Text>;
  }
  if (status === "error") {
    return <Text>Error loading resume</Text>;
  }
  if (resume?.translated?.content[lang] !== undefined)
    await remark()
      .use(gfm)
      .use(remarkFlexibleToc, { tocRef: toc })
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(
        (resume?.translated?.content[lang] as string) || resume?.content
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
          {resume?.contentType === "markdown" ? (
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
                  <Text
                    fontSize="xl"
                    {...props}
                    mt={4}
                    fontWeight={600}
                    ml={1}
                  />
                ),
                h3: (props) => (
                  <Text
                    fontSize="lg"
                    {...props}
                    mt={4}
                    fontWeight={500}
                    ml={2}
                  />
                ),
                h4: (props) => (
                  <Text
                    fontSize="md"
                    {...props}
                    mt={4}
                    fontWeight={400}
                    ml={4}
                  />
                ),
                h5: (props) => (
                  <Text
                    fontSize="sm"
                    {...props}
                    mt={4}
                    fontWeight={300}
                    ml={6}
                  />
                ),
                h6: (props) => (
                  <Text
                    fontSize="xs"
                    {...props}
                    mt={4}
                    fontWeight={200}
                    ml={8}
                  />
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
              }}
            >
              {resume?.translated?.content[lang] || resume?.content}
            </Markdown>
          ) : (
            <Box
              dangerouslySetInnerHTML={
                {
                  __html: resume?.translated?.content[lang] || resume?.content,
                } as any
              }
            ></Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
