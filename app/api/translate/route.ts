import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axios, { isCancel, AxiosError } from "axios";
import { logger } from "firebase-functions/v1";
import { VerifyToken } from "utils/verifyIdToken";
import { StatusCodes } from "http-status-codes";
import { db } from "config/firebase";
import { BlogCollectionRef } from "models/models";
import { Post } from "types/interfaces";

export async function POST(request: NextRequest) {
  logger.info("POST /api/shop/items");
  const auth = request.headers.get("Authorization");
  logger.info("auth: " + auth);
  const customToken = request.headers.get("customToken");
  logger.info("customToken: " + customToken);
  if (!auth || !customToken) {
    logger.info("Unauthorized request");
    return NextResponse.json(
      { error: "Unauthorized request" },
      { status: 401 }
    );
  }
  logger.info("Verifying token");
  const userData = await VerifyToken({
    authorization: auth,
    customToken: customToken,
  });
  if (!userData) {
    logger.info("Unauthorized request");
    return NextResponse.json(
      { error: "Unauthorized request" },
      { status: 401 }
    );
  }
  // check if user is admin from custom claims
  const isAdmin = userData.decodedToken.claims.role === "admin";
  const isSeller = userData.decodedToken.claims.role === "seller";
  if (!isAdmin && !isSeller) {
    return NextResponse.json(
      { error: "Unauthorized request" },
      { status: 401 }
    );
  }

  const item = (await request.json()) as Post;

  const inUrl = new URL(request.url);
  const sourceLang = inUrl.searchParams.get("sourceLang");
  const targetLang = inUrl.searchParams.get("targetLang");
  //   TRANSLATION_API_URL.
  const translationApiUrl = `${process.env.TRANSLATION_API_URL}/translateByLang?sourceLang=${sourceLang}&targetLang=${targetLang}`;
  const description = item.data?.description;
  const title = item.data?.title;
  const category = item.data?.category;
  // translate the title
  const titleResponse = await axios.post(translationApiUrl, title, {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  });
  logger.info("titleResponse: " + JSON.stringify(titleResponse.data));
  const translatedTitle = titleResponse.data;
  // translate the description
  const descriptionResponse = await axios.post(translationApiUrl, description, {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  });
  logger.info(
    "descriptionResponse: " + JSON.stringify(descriptionResponse.data)
  );
  const translatedDescription = descriptionResponse.data;
  // translate the category

  const categoryResponse = await axios.post(translationApiUrl, category, {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  });
  logger.info("categoryResponse: " + JSON.stringify(categoryResponse.data));
  const translatedCategory = categoryResponse.data;
  // create a new item with the translated data
  const newItem = {
    translated: {
      title: {
        fon: translatedTitle,
      },
      description: {
        fon: translatedDescription,
      },
      category: {
        fon: translatedCategory,
      },
    },
  };

  // update the item with the translated data
  const itemRef = db.collection(BlogCollectionRef).doc();
  await itemRef.set(newItem, { merge: true });
  return NextResponse.json(newItem, { status: StatusCodes.CREATED });
}
