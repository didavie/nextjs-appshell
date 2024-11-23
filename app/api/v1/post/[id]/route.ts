import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Post } from "types/interfaces";
import { db, auth, admin, auth as authh } from "config/firebase";
import { BlogCollectionRef } from "models/models";
import { logger } from "firebase-functions/v1";
import { VerifyToken } from "utils/verifyIdToken";
import { StatusCodes } from "http-status-codes";
import { FieldValue } from "firebase-admin/firestore";

// add view to post and view ip address
export async function PUT(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const auth = request.headers.get("Authorization");
  const customToken = request.headers.get("customToken");
  let viewer =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for") ||
    "";
  if (auth && customToken) {
    const userData = await VerifyToken({
      authorization: auth,
      customToken: customToken,
    });
    if (userData) {
      viewer = userData.decodedToken.uid as string;
    }
  }

  //   get post
  const postRef = db.collection(BlogCollectionRef).doc(id);
  const post = (await postRef.get()).data() as Post;
  if (!post) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: StatusCodes.NOT_FOUND }
    );
  }
  const view = post.views || 0;
  const views = view + 1;
  let viwers = post.viwers || [];
  if (!viwers.includes(viewer)) {
    viwers.push(viewer);
  }
  await postRef.update({
    views,
  });
  return NextResponse.json(
    { message: "Post view added" },
    { status: StatusCodes.OK }
  );
}
