import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "../../../../types/interfaces";
import { db, auth as th, admin } from "../../../../config/firebase";
import { UserCollectionRef } from "../../../../models/models";
import { logger } from "firebase-functions/v1";
import { VerifyToken } from "../../../../utils/verifyIdToken";
import { signInWithEmailAndPassword } from "firebase/auth";

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
    console.log("Unauthorized request");
    return NextResponse.json(
      { error: "Unauthorized request" },
      { status: 401 }
    );
  }
  const body = await request.json();

  const {
    updateType,
    data: user,
  }: {
    updateType: string;
    data: User;
  } = body;
  if (!updateType || !user) {
    logger.info("Invalid request");
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const {
    id,
    displayName,
    firstName,
    lastName,
    password,
    confirmPassword,
    email,
    phoneNumber,
    address,
    country,
    oldPassword,
  } = user;
  if (!id) {
    logger.info("User id is required");
    return NextResponse.json({ error: "User id is required" }, { status: 400 });
  }
  if (id !== userData.decodedToken.uid) {
    logger.info("Unauthorized request access to another user");
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 403 }
    );
  }
  if (updateType === "profile") {
    if (
      !displayName ||
      !firstName ||
      !lastName ||
      !country ||
      !email ||
      !phoneNumber ||
      !country
    ) {
      logger.info(
        "Display name, first name, last name, country and address are required"
      );
      return NextResponse.json(
        {
          error:
            "Display name, first name, last name, country and address are required",
        },
        { status: 400 }
      );
    }
  } else if (updateType === "password") {
    if (!password || !confirmPassword || !oldPassword) {
      logger.info("Password and confirm password are required");
      return NextResponse.json(
        { error: "Password and confirm password are required" },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      logger.info("Passwords do not match");
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      logger.info("Password must be at least 6 characters");
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (password === oldPassword) {
      logger.info("New password must be different from old password");
      return NextResponse.json(
        { error: "New password must be different from old password" },
        { status: 400 }
      );
    }

    if (oldPassword.length < 6) {
      logger.info("Old password must be at least 6 characters");
      return NextResponse.json(
        { error: "Old password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!email) {
      logger.info("Email is required");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
  } else if (updateType === "address") {
    if (!address) {
      logger.info("Address is required");
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip ||
      !address.countryData
    ) {
      logger.info("Street, city, state and zip are required");
      return NextResponse.json(
        {
          error: "Street, city, state and zip are required",
        },
        { status: 400 }
      );
    }
  }

  const userFromAdmin = await admin.auth().getUser(id);
  let userRef = await db.collection(UserCollectionRef).doc(id).get();
  if (!userFromAdmin) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const role = userFromAdmin.customClaims?.role;
  if (!role) {
    admin.auth().setCustomUserClaims(id, { role: "shopper" });
  }
  if (!userRef.exists) {
    await db
      .collection(UserCollectionRef)
      .doc(id)
      .set({
        id: id,
        role: role || "shopper",
      });
  }
  console.log("updateType: " + updateType);
  console.log("id: ", user);
  if (updateType === "profile") {
    try {
      await admin
        .auth()
        .updateUser(id, {
          displayName: firstName + " " + lastName,
          email: email,
          phoneNumber: `${country?.dial_code}${phoneNumber}`,
        })
        .catch((error) => {
          logger.info("Error updating profile");
          return NextResponse.json(
            { error: "Error updating profile" },
            { status: 500 }
          );
        });
      await db.collection(UserCollectionRef).doc(id).set(
        {
          country: country,
        },
        { merge: true }
      );
      return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "Error updating profile" },
        { status: 500 }
      );
    }
  } else if (updateType === "password") {
    try {
      // Check if old password is correct
      await signInWithEmailAndPassword(
        th,
        email as string,
        oldPassword as string
      ).catch((error) => {
        return NextResponse.json(
          { error: "Old password is incorrect" },
          { status: 400 }
        );
      });

      await admin.auth().updateUser(id, {
        password: password,
      });
      return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "Error updating password" },
        { status: 500 }
      );
    }
  } else if (updateType === "address") {
    try {
      await db.collection(UserCollectionRef).doc(id).set(
        {
          address: address,
        },
        { merge: true }
      );
      return NextResponse.json({ message: "Address updated successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "Error updating address" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
