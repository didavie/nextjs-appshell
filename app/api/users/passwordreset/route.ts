import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "../../../../types/interfaces";
import { db, auth as th, admin } from "../../../../config/firebase";

import { EmailCollectionRef } from "@/models/models";
import { logger } from "firebase-functions/v1";
import { VerifyToken } from "../../../../utils/verifyIdToken";

export async function PUT(request: NextRequest) {
  logger.info("PUT /api/users/passwordreset");

  const body = await request.json();
  const { email } = body;
  if (!email) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  try {
    const user = await admin.auth().getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const link = await admin.auth().generatePasswordResetLink(email);
    const emailRef = db.collection(EmailCollectionRef).doc();
    const emailData = {
      to: email,
      message: {
        subject: "Cami Market Password Reset",
        html: `<div
        style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif"
        ><p>Click <a href="${link}">here</a> to reset your password</p> 
        <p>Or copy and paste this link to your browser: ${link}</p><div>
        <div
        style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif"
        ><p>If you did not request a password reset, please ignore this email</p></div>
        <div
        style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif"
        ><p>Thank you</p></div>`,
      },
    };
    await emailRef.set(emailData);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { message: "Password reset email sent" },
    { status: 200 }
  );
}
