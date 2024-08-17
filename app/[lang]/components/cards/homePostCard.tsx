import { FontSizeSM, FontSizeXS, FontSizeXXS } from "@/config/styling";
import { Post } from "@/types/interfaces";
import { Avatar, Box, Text } from "@chakra-ui/react";
import { Locale } from "i18n-config";
import useAppRouter from "@/hooks/useAppRouter";

const HomePostCard = ({ post, lang }: { post: Post; lang: Locale }) => {
  const router = useAppRouter();
  console.log(post);
  if (!post) {
    return <Box>404 - Not Found</Box>;
  }
  if (!post.translated) {
    return null;
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
          size={"sm"}
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
          fontSize={FontSizeXS}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Text fontSize={FontSizeXS} fontWeight="bold">
            {post.author?.name}
          </Text>
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
          <Text fontSize={FontSizeSM} fontWeight="bold" color="gray.800" mb={1}>
            {post.translated?.title[lang] || post.data?.title}
          </Text>
          <Text fontSize={FontSizeXS} color="gray.500" opacity={0.8}>
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
            fontSize={FontSizeXXS}
            color="blue.500"
            opacity={0.8}
            fontWeight={"bold"}
          >
            {post.translated?.category[lang] || post.data?.category}
          </Text>
          <Text
            fontSize={FontSizeXXS}
            opacity={0.8}
            fontWeight={"bold"}
            ml={1}
            mr={1}
          >{`<<`}</Text>
          <Text
            fontSize={FontSizeXXS}
            color="teal.400"
            opacity={0.8}
            fontWeight={"bold"}
          >
            {post.translated?.types[lang] || post.data?.types}
          </Text>
        </Box>
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
                  fontSize={FontSizeXXS}
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
              fontSize={FontSizeXXS}
              color="gray.500"
              opacity={0.8}
              fontWeight={"bold"}
              mr={1}
            ></Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HomePostCard;
