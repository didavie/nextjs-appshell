"use client";

import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { BlogCollectionRef } from "@/models/models";
import { Locale } from "i18n-config";
import { Post } from "@/types/interfaces";
import { Box, Text } from "@chakra-ui/react";

import { remark } from "remark";

import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkFlexibleToc from "remark-flexible-toc";
import "katex/dist/katex.min.css";
import AhiLoading from "@/components/loading";
import { useEffect, useState } from "react";
import useAppRouter from "@/hooks/useAppRouter";

const Page = ({ params: { lang } }: { params: { lang: Locale } }) => {
  // const firestore = useFirestore();
  // const d = doc(firestore, BlogCollectionRef, id as string);
  // const { status, data: post } = useFirestoreDocData<Post>(d, {
  //   idField: "id",
  // });
  // const [ago, setAgo] = useState<string>("");
  // const router = useAppRouter();

  // useEffect(() => {
  //   if (!post || !post.createdAt || status !== "success") {
  //     return;
  //   }
  //   const now = new Date();
  //   const created = new Date(post?.createdAt || 0);
  //   const diff = now.getTime() - created.getTime();
  //   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  //   const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  //   const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  //   if (days > 0) {
  //     setAgo(`${days} days ago`);
  //   } else if (hours > 0) {
  //     setAgo(`${hours} hours ago`);
  //   } else if (minutes > 0) {
  //     setAgo(`${minutes} minutes ago`);
  //   } else {
  //     setAgo(`${seconds} seconds ago`);
  //   }
  // }, [post, status]);
  // const toc: any = [];

  // if (status === "loading") {
  //   return <AhiLoading />;
  // }
  // if (!post) {
  //   return null;
  // }
  // if (status === "error") {
  //   return null;
  // }
  // if (post.translated?.content[lang] !== undefined)
  //   await remark()
  //     .use(gfm)
  //     .use(remarkFlexibleToc, { tocRef: toc })
  //     .use(remarkRehype)
  //     .use(rehypeStringify)
  //     .process(
  //       (post.translated?.content[lang] || post.data?.content) as string
  //     );

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="left"
      width="100%"
      minH={"100vh"}
    >
      <Text>No Presentation Found</Text>
    </Box>
  );
};

export default Page;
