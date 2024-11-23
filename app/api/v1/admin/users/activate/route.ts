import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "types/interfaces";
import { db, auth, admin, auth as authh } from "config/firebase";
import { UserCollectionRef } from "models/models";
import { logger } from "firebase-functions/v1";
import { VerifyToken } from "utils/verifyIdToken";
import { StatusCodes } from "http-status-codes";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("Authorization");
  const customToken = request.headers.get("customToken");
  if (!auth || !customToken) {
    return NextResponse.json(
      { error: "Authorization header is required" },
      { status: 401 }
    );
  }
  const userData = await VerifyToken({
    authorization: auth,
    customToken: customToken,
  });
  if (!userData) {
    logger.info("Unauthorized request");
    return NextResponse.json(
      { error: "USER NOT AUTHORIZED" },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  // check is user is admin or superadmin
  // get the user claims
  const userClaims = await admin
    .auth()
    .getUser(userData.decodedToken.uid as string);
  if (!userClaims.customClaims) {
    logger.info("User not authorized");
    logger.info(userClaims.customClaims);
    return NextResponse.json(
      {
        message: {
          error: "User not authorized ",
          data: userClaims.customClaims,
        },
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  const roleAdmin = userClaims.customClaims.roles?.includes("admin");
  const roleSuperAdmin = userClaims.customClaims.roles?.includes("superadmin");

  if (!roleAdmin && !roleSuperAdmin) {
    logger.info("User is not authorized");
    logger.info(userClaims.customClaims, roleAdmin, roleSuperAdmin);
    return NextResponse.json(
      { message: "User is not authorized" },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  const body = await request.json();
  const user: Partial<User> = body;

  const { id } = user;
  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    const userRef = db.collection(UserCollectionRef).doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { message: "User not found" },
        { status: StatusCodes.NOT_FOUND }
      );
    }
    const userData = userDoc.data() as User;
    // check if user is already active
    if (userData.status === "active") {
      return NextResponse.json(
        { message: "User is already active" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    // check if user is blocked
    if (userData.status === "blocked") {
      return NextResponse.json(
        { message: "User is blocked" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    await admin.auth().revokeRefreshTokens(id);
    await admin.auth().updateUser(id, {
      disabled: false,
    });
    await userRef.update({ status: "active" });
    return NextResponse.json(
      { message: "User activated successfully" },
      { status: StatusCodes.OK }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
