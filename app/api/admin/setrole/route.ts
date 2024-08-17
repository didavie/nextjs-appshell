import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "../../../../types/interfaces";
import { db, auth, admin } from "../../../../config/firebase";
import { UserCollectionRef } from "../../../../models/models";
import { logger } from "firebase-functions/v1";
import { VerifyToken } from "../../../../utils/verifyIdToken";
import { StatusCodes } from "http-status-codes";

export async function PUT(request: NextRequest) {
  logger.info("PUT /api/shop/items");
  const auth = request.headers.get("Authorization");
  logger.info("auth: " + auth);
  const customToken = request.headers.get("customToken");
  logger.info("customToken: " + customToken);
  if (!auth || !customToken) {
    console.log("Unauthorized request");
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
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  // check is user is admin or superadmin
  // get the user claims
  const userClaims = await admin
    .auth()
    .getUser(userData.decodedToken.uid as string);
  if (!userClaims.customClaims) {
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  const roleAdmin = userClaims.customClaims.role === "admin";
  const roleSuperAdmin = userClaims.customClaims.role === "superadmin";

  if (!roleAdmin || !roleSuperAdmin) {
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  const body = await request.json();
  const user: User = body;

  const { role, id } = user;

  if (!role) {
    return NextResponse.json(
      { message: "Role is required" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  // check if the user exists
  const userRef = db.collection(UserCollectionRef).doc(id);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    // check if the user exists in firebase auth
    const userAuth = await admin.auth().getUser(id);
    if (!userAuth) {
      //  check if the user exists with email id
      const userByEmail = await admin.auth().getUserByEmail(id);
      if (!userByEmail) {
        return NextResponse.json(
          { message: "User not found" },
          { status: StatusCodes.NOT_FOUND }
        );
      }
    }
  }

  try {
    await admin.auth().setCustomUserClaims(id, { role });
    await db.collection(UserCollectionRef).doc(id).update({ role });
    return NextResponse.json(
      { message: "Role updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
