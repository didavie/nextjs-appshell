import { base } from "@/redux/api/base";
import { Post, User } from "types/interfaces";

export const postApi = base.injectEndpoints({
  endpoints: (build) => ({
    getPost: build.query<{ id: string }, User>({
      query: ({ id }) => ({
        url: `/api/v1/post/${id}`,
        method: "GET",
      }),
    }),
    getPosts: build.query<void, Post[]>({
      query: () => ({
        url: "/api/v1/posts",
        method: "GET",
      }),
    }),
    // add like to post
    addLike: build.mutation<{ id: string }, Partial<Post>>({
      query: ({ id }) => ({
        url: `/api/v1/post/${id}/like`,
        method: "PUT",
      }),
    }),
    // remove like from post
    removeLike: build.mutation<{ id: string }, Partial<Post>>({
      query: ({ id }) => ({
        url: `/api/v1/post/${id}/like`,
        method: "DELETE",
      }),
    }),
    // view post
    viewPost: build.mutation<{ id: string }, Partial<Post>>({
      query: ({ id }) => ({
        url: `/api/v1/post/${id}/view`,
        method: "PUT",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPostQuery,
  useGetPostsQuery,
  useAddLikeMutation,
  useRemoveLikeMutation,
  useViewPostMutation,
  endpoints: { getPost, getPosts, addLike, removeLike, viewPost },
} = postApi;
