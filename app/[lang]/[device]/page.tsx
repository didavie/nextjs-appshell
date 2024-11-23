"use client";
import { collection, query, orderBy } from "firebase/firestore";
import { useFirestore } from "reactfire";
import { BlogCollectionRef } from "@/models/models";
import { useFirestoreCollectionData } from "reactfire";
import { Post } from "@/types/interfaces";
import { Locale } from "i18n-config";
import { Box } from "@chakra-ui/react";
import useAppRouter from "@/hooks/useAppRouter";
import AhiLoading from "./components/loading";
import { Home } from "tabler-icons-react";
import HomePostCard from "./components/cards/homePostCard";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/redux/store/store";
import { adminApi } from "@/components/api/v1/admin";
import { useAppDispatch } from "@/hooks/useAppDispatch";

const Page = async ({ params: { lang } }: { params: { lang: Locale } }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const firestore = useFirestore();
  const { viewPostsFilter } = useAppSelector((state: RootState) => state.ui);
  const q = query(
    collection(firestore, BlogCollectionRef),
    orderBy("createdAt")
  );
  const { status, data } = useFirestoreCollectionData<Post>(q, {
    idField: "id",
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!posts || status !== "success") {
      return;
    }
    if (posts.length <= 1) {
      return;
    }
    if (viewPostsFilter === "Latest") {
      const p = posts.sort((a, b) => {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      });
      setPosts(p);
    } else if (viewPostsFilter === "Popular") {
      const p = posts.sort((a, b) => {
        return (b.likes || 0) - (a.likes || 0);
      });
      setPosts(p);
    } else if (viewPostsFilter === "Category") {
      // sort by category
      const p = posts.sort((a, b) => {
        if (a.translated?.category[lang] && b.translated?.category[lang])
          return a.translated?.category[lang].localeCompare(
            b.translated?.category[lang]
          );
        return 0;
      });
      setPosts(p);
    }
  }, [viewPostsFilter]);

  useEffect(() => {
    if (status === "success") {
      setPosts(data);
    }
  }, [data, status]);

  useEffect(() => {
    const asyncFunc = async () => {
      await dispatch(
        adminApi.endpoints.setRole.initiate({ id: "", role: "user" })
      );
    };
    asyncFunc();
  }, [status]);

  if (status === "loading") {
    return <AhiLoading />;
  }

  if (!data) {
    return <Box>404 - Not Found</Box>;
  }

  if (data.length === 0) {
    return <Box>No posts found</Box>;
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      width="100%"
      minHeight="100vh"
      pt={4}
    >
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
          p={2}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            width="100%"
            minHeight="100vh"
          >
            {posts.map((post) => (
              <HomePostCard key={post.id} post={post} lang={lang} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
