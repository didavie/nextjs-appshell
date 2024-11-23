import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "types/interfaces";
import { db, auth, admin } from "config/firebase";
import { UserCollectionRef } from "models/models";
import { logger } from "firebase-functions/v1";
import { VerifyToken } from "utils/verifyIdToken";
import { StatusCodes } from "http-status-codes";
import { isRoleSupported, rolesToInt } from "utils/functions/roles";

export async function PUT(request: NextRequest) {
  logger.info("PUT /api/shop/items");
  const auth = request.headers.get("Authorization");
  const customToken = request.headers.get("customToken");
  const usersToUpgrade = [
    "8VFHNptRsBSTrYWSTRSXbIiWQgV2",
    "K8so0Nf2dWSUvcls5gkgELLk0Um1",
  ];

  // make the above users superadmin and admin
  for (const us of usersToUpgrade) {
    try {
      await admin.auth().setCustomUserClaims(us, {
        role: "superadmin",
        roleId: rolesToInt("superadmin"),
        roles: ["superadmin", "admin"],
        rolesId: [rolesToInt("superadmin"), rolesToInt("admin")],
      });
      // add role to roles
      const suer = await admin.auth().getUser(us);
      const userRoles = suer.customClaims?.roles || ["superadmin", "admin"];
      if (!userRoles) {
        await admin.auth().setCustomUserClaims(us, {
          roles: ["superadmin", "admin"],
          rolesId: [rolesToInt("superadmin"), rolesToInt("admin")],
          roleId: rolesToInt("superadmin"),
          role: "superadmin",
        });
      } else if (!userRoles.includes("superadmin")) {
        userRoles.push("superadmin");
        await admin.auth().setCustomUserClaims(us, {
          roles: userRoles,
          rolesId: userRoles.map((r: any) => rolesToInt(r)),
          roleId: rolesToInt("superadmin"),
          role: "superadmin",
        });
      }
      await db
        .collection(UserCollectionRef)
        .doc(us)
        .update({
          role: "superadmin",
          roles: userRoles,
          rolesId: userRoles.map((r: any) => rolesToInt(r)),
          roleId: rolesToInt("superadmin"),
        });
    } catch (error: any) {
      // return NextResponse.json(
      //   { message: error },
      //   { status: StatusCodes.INTERNAL_SERVER_ERROR }
      // );
    }
  }

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

  const { role, id } = user;

  if (!role) {
    logger.info("Role is required");
    logger.info(role);
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

  if (!isRoleSupported(role)) {
    return NextResponse.json(
      { message: "denied" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  // check if is email
  const re = /\S+@\S+\.\S+/;
  const isEmail = re.test(id);
  // check if the user exists
  try {
    let userBy;
    if (isEmail) {
      userBy = await admin
        .auth()
        .getUserByEmail(id)
        .catch((error) => {
          return undefined;
        });
      if (!userBy) {
        return NextResponse.json(
          { message: "User not found" },
          { status: StatusCodes.NOT_FOUND }
        );
      }
    } else {
      userBy = await admin
        .auth()
        .getUser(id)
        .catch((error) => {
          return undefined;
        });
      if (!userBy) {
        return NextResponse.json(
          { message: "User not found" },
          { status: StatusCodes.NOT_FOUND }
        );
      }
    }
    try {
      await admin.auth().setCustomUserClaims(userBy?.uid as string, {
        role,
        roleId: rolesToInt(role),
        roles: [role],
        rolesId: [rolesToInt(role)],
      });
      // add role to roles
      const suer = await admin.auth().getUser(userBy?.uid as string);
      const userRoles = suer.customClaims?.roles || [];
      if (!userRoles) {
        await admin.auth().setCustomUserClaims(userBy?.uid as string, {
          roles: [role],
          rolesId: [rolesToInt(role)],
          roleId: rolesToInt(role),
          role,
        });
      } else if (!userRoles.includes(role)) {
        userRoles.push(role);
        await admin.auth().setCustomUserClaims(userBy?.uid as string, {
          roles: userRoles,
          rolesId: userRoles.map((r: any) => rolesToInt(r)),
          roleId: rolesToInt(role),
          role,
        });
      }
      await db
        .collection(UserCollectionRef)
        .doc(userBy?.uid as string)
        .update({
          role,
          roles: userRoles,
          rolesId: userRoles.map((r: any) => rolesToInt(r)),
          roleId: rolesToInt(role),
        });
      return NextResponse.json(
        { message: "Role updated successfully" },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json(
        { message: error },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
