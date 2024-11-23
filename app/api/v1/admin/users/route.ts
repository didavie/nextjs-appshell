import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "types/interfaces";
import { db, auth, admin, auth as authh } from "config/firebase";
import { UserCollectionRef } from "models/models";
import { logger } from "firebase-functions/v1";
import { VerifyToken } from "utils/verifyIdToken";
import { StatusCodes } from "http-status-codes";
import { rolesToInt } from "utils/functions/roles";

// get all users
export async function GET(request: NextRequest) {
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
  const users = await db.collection(UserCollectionRef).get();
  const usersData: User[] = [];
  users.forEach((doc) => {
    // get the data from admin
    usersData.push(doc.data() as User);
  });

  const usersAd = await admin.auth().listUsers(1000);
  logger.info("total users", usersAd.users.length);
  for (let i = 0; i < usersData.length; i++) {
    const userAd = usersAd.users.find((u) => u.uid === usersData[i].id);
    if (userAd) {
      usersData[i].email = userAd.email;
      usersData[i].phoneNumber = userAd.phoneNumber;
      usersData[i].photoURL = userAd.photoURL;
      usersData[i].isVerified = userAd.emailVerified;
      usersData[i].createdAt = userAd.metadata.creationTime;
      usersData[i].updatedAt = userAd.metadata.lastSignInTime;
      usersData[i].role = userAd.customClaims?.roles;
      usersData[i].status = userAd.customClaims?.status || "active";
      usersData[i].displayName = userAd.displayName;
      //   is the email verified but user data is not updated
      try {
        if (userAd.emailVerified && usersData[i].status !== "active") {
          await db
            .collection(UserCollectionRef)
            .doc(usersData[i].id as string)
            .set(
              {
                status: "active",
              },
              { merge: true }
            );
          usersData[i].status = "active";
        }
      } catch (error) {
        logger.error(
          `Error updating user status for user ${usersData[i].id}`,
          error
        );
      }
      //   if user role does not match the custom claim, update the db
      try {
        if (usersData[i].roles !== userAd.customClaims?.roles) {
          await db
            .collection(UserCollectionRef)
            .doc(usersData[i].id as string)
            .set(
              {
                role: userAd.customClaims?.role,
                roles: userAd.customClaims?.roles,
                roleId: userAd.customClaims?.roleId,
                roleIds: userAd.customClaims?.roleIds,
              },
              { merge: true }
            );
          usersData[i].role = userAd.customClaims?.role;
        }
      } catch (error) {
        logger.error(
          `Error updating user role for user ${usersData[i].id}`,
          error
        );
      }

      //   if user status does not match the custom claim, update the db
      try {
        if (usersData[i].status !== userAd.customClaims?.status) {
          await db
            .collection(UserCollectionRef)
            .doc(usersData[i].id as string)
            .set(
              {
                status: userAd.customClaims?.status || "active",
              },
              { merge: true }
            );
          usersData[i].status = userAd.customClaims?.status || "active";
        }
      } catch (error) {
        logger.error(
          `Error updating user status for user ${usersData[i].id}`,
          error
        );
      }
    } else {
      logger.error("User not found in admin", usersData[i].id);
    }
  }
  // add all the users in the same array
  for (let i = 0; i < usersAd.users.length; i++) {
    const user = usersAd.users[i];
    if (!user.customClaims?.role) {
      await admin.auth().setCustomUserClaims(user.uid, {
        role: "shopper",
        roles: ["shopper"],
        rolesId: [rolesToInt("shopper")],
        roleId: rolesToInt("shopper"),
      });
      // add the role to the user in the db
      await db
        .collection(UserCollectionRef)
        .doc(user.uid)
        .update({
          role: "shopper",
          roles: ["shopper"],
          rolesId: [rolesToInt("shopper")],
          roleId: rolesToInt("shopper"),
        });
    }
    const userExists = usersData.find((u) => u.id === user.uid);
    if (!userExists) {
      usersData.push({
        id: user.uid,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        isVerified: user.emailVerified,
        createdAt: user.metadata.creationTime,
        updatedAt: user.metadata.lastSignInTime,
        role: user.customClaims?.role || "shopper",
        status: user.customClaims?.status || "active",
        displayName: user.displayName,
      });
      if (!user.customClaims?.roles) {
        await admin.auth().setCustomUserClaims(user.uid, {
          roles: user.customClaims?.role ? [user.customClaims?.role] : [],
        });
        // add the role to the user in the db
        await db
          .collection(UserCollectionRef)
          .doc(user.uid)
          .set(
            {
              roles: user.customClaims?.role ? [user.customClaims?.role] : [],
              rolesId: user.customClaims?.role
                ? [rolesToInt(user.customClaims?.role)]
                : [],
              roleId: user.customClaims?.role
                ? rolesToInt(user.customClaims?.role)
                : 0,
              role: user.customClaims?.role || "shopper",
            },
            { merge: true }
          );
      }

      // add the user to the db
      try {
        const docRef = db.collection(UserCollectionRef).doc(user.uid);
        await docRef.set({
          id: user.uid,
          isVerified: user.emailVerified || false,
          createdAt: user.metadata.creationTime,
          updatedAt: user.metadata.lastSignInTime,
          role: user.customClaims?.role || "shopper",
          status: user.customClaims?.status || "active",
          roles: user.customClaims?.roles || [],
          rolesId: user.customClaims?.roles
            ? user.customClaims?.roles.map((role: any) => rolesToInt(role))
            : [],
          roleId: user.customClaims?.roles
            ? user.customClaims?.roles.map((role: any) => rolesToInt(role))
            : 0,
        });
        // if user does not has roles array, add it
      } catch (error) {
        logger.error(`Error adding user ${user.uid} to db`, error);
      }
    }
  }

  return NextResponse.json({ users: usersData });
}
