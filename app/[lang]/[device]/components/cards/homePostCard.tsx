import {
  FontSizeLG,
  FontSizeMD,
  FontSizeSM,
  FontSizeXS,
  FontSizeXXS,
} from "@/config/styling";
import { Post } from "@/types/interfaces";
import { Avatar, Box, Text } from "@chakra-ui/react";
import { Locale } from "i18n-config";
import useAppRouter from "@/hooks/useAppRouter";
import { postApi } from "@/components/api/v1/post";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ScrollArea } from "@mantine/core";

const HomePostCard = ({ post, lang }: { post: Post; lang: Locale }) => {
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  //console.log(post);
  if (!post) {
    return <Box>404 - Not Found</Box>;
  }

  return (
    <Box
      key={post.id}
      p={2}
      w={"100%"}
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="left"
      border={"solid"}
      borderColor="gray.400"
      borderRadius={10}
      borderWidth={1}
      mb={4}
      onClick={() => router.push(`/${lang}/post/view/posts/${post.id}`)}
    >
      <Box width="fit-content" mr={4}>
        <Avatar
          name={post.author?.name}
          src={post.author?.photoURL}
          size={"md"}
        />
      </Box>
      <Box
        w={"100%"}
        // display="flex"
        // flexDirection="column"
        // justifyContent="flex-start"
        // alignItems="left"
      >
        <Box
          fontSize={FontSizeMD}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Text fontSize={FontSizeMD}>{post.author?.name}</Text>
          <Text fontSize={FontSizeXXS}>
            {new Date(post.publishedAt || "").toDateString()}
          </Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="left"
          width="100%"
        >
          <Text fontSize={FontSizeLG} fontWeight="bold" color="gray.800" mb={1}>
            {post.translated?.title[lang] || post.data?.title}
          </Text>
          <Text fontSize={FontSizeMD} color="gray.500" opacity={0.8}>
            {post.translated?.description[lang] || post.data?.description}
          </Text>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="left"
          width="100%"
        >
          <Text
            fontSize={FontSizeXS}
            color="blue.500"
            opacity={0.8}
            fontWeight={"bold"}
          >
            {post.translated?.category[lang] || post.data?.category}
          </Text>
          <Text
            fontSize={FontSizeXS}
            opacity={0.8}
            fontWeight={"bold"}
            ml={1}
            mr={1}
          >{`<<`}</Text>
          <Text
            fontSize={FontSizeXS}
            color="teal.400"
            opacity={0.8}
            fontWeight={"bold"}
          >
            {post.translated?.types[lang] || post.data?.types}
          </Text>
        </Box>
        <ScrollArea scrollbars="x" style={{ width: "100%" }}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="left"
            width="100%"
          >
            {post.translated?.tags[lang]?.split(",") &&
            post.translated?.tags[lang]?.split(",").length > 0 ? (
              post.translated?.tags[lang]
                .split(",")
                .filter((tag) => tag !== "")
                ?.map((tag) => (
                  <Text
                    fontSize={FontSizeXS}
                    color="gray.500"
                    opacity={0.8}
                    fontWeight={"bold"}
                    mr={1}
                  >
                    #{tag}
                  </Text>
                ))
            ) : (
              <Text
                fontSize={FontSizeXS}
                color="gray.500"
                opacity={0.8}
                fontWeight={"bold"}
                mr={1}
              ></Text>
            )}
          </Box>
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default HomePostCard;
