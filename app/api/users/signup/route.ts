import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "../../../../types/interfaces";
import { db, auth, admin } from "../../../../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  UserCollectionRef,
  EmailCollectionRef,
} from "../../../../models/models";
import { logger } from "firebase-functions/v1";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user: User = body;
  const { email, password, confirmPassword } = user;
  const { firstName, lastName } = user;
  if (!email || !password) {
    logger.error("Email and password are required");
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    logger.error("Password must be at least 6 characters");
    return NextResponse.json(
      {
        message: "Password must be at least 6 characters",
      },
      { status: 400 }
    );
  }
  if (password !== confirmPassword) {
    logger.error("Passwords do not match");
    return NextResponse.json(
      { message: "Passwords do not match" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    logger.error("Password must be at least 6 characters");
    return NextResponse.json(
      {
        message: "Password must be at least 6 characters",
      },
      { status: 400 }
    );
  }
  if (!firstName) {
    logger.error("First name is required");
    return NextResponse.json(
      { message: "First name is required" },
      { status: 400 }
    );
  }
  if (firstName.length < 2) {
    logger.error("First name must be at least 2 characters");
    return NextResponse.json(
      {
        message: "First name must be at least 2 characters",
      },
      { status: 400 }
    );
  }
  if (!lastName) {
    logger.error("Last name is required");
    return NextResponse.json(
      { message: "Last name is required" },
      { status: 400 }
    );
  }
  if (lastName.length < 2) {
    logger.error("Last name must be at least 2 characters");
    return NextResponse.json(
      {
        message: "Last name must be at least 2 characters",
      },
      { status: 400 }
    );
  }

  // check if user exists from admin
  const userRecord = await admin
    .auth()
    .getUserByEmail(email)
    .catch((error) => {
      logger.error("user not found", error);
      return null;
    });

  if (userRecord) {
    logger.error("User already exists");
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }
  logger.info("creating user", user);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    logger.info("user created", userCredential);
    const { user } = userCredential;
    const { uid } = user;

    await db
      .collection(UserCollectionRef)
      .doc(uid)
      .set({
        role: 100,
        status: "active",
        isVerified: false,
        id: uid,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        currency: "xof",
      });
    logger.info("user added to db", user);
    await admin.auth().setCustomUserClaims(uid, { role: 100 });
    await admin.auth().updateUser(uid, {
      displayName: `${firstName} ${lastName}`,
    });
    logger.info("user updated", user);

    //  send email verification
    await sendEmailVerification(user);

    // send welcome email
    await db.collection(EmailCollectionRef).add({
      to: email,
      message: {
        subject: "Welcome to Didavie Cami Market",
        html: `<p>Hi ${firstName},</p> <p>Welcome to Didavie Cami Market. We are excited to have you on board. Please verify your email address to get started. You will receive an email with a link to verify your email address. If you have any questions, please reply to this email.</p> <p>Thanks, Didavie Cami Market
Team</p>`,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating user", error },
      { status: 400 }
    );
  }
}
