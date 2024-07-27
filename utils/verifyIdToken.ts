import { logger } from "firebase-functions/v1";
import { DecodedIdToken } from "firebase-admin/auth";
import { admin } from "../config/firebase";

export const VerifyToken = async ({
  authorization,
  customToken,
}: {
  authorization: string;
  customToken: string;
}) => {
  if (
    !customToken ||
    typeof customToken !== "string" ||
    customToken.length === 0
  ) {
    logger.error("Unauthorized, no custom token provided");
    return null;
  }

  if (
    !authorization ||
    typeof authorization !== "string" ||
    authorization.length === 0
  ) {
    logger.error("Unauthorized, no authorization header provided");
    return null;
  }

  // logger.info("Verifying token");
  const token = authorization.split(" ")[1];

  const decodedToken = (await admin
    .auth()
    .verifyIdToken(token, true)
    .catch((error: any) => {
      // logger.error(error);
      //  if token is expired, log user out.
      if (error.code === "auth/id-token-expired") {
        logger.error("Unauthorized/Expired token");
        return null;
      } else {
        logger.error("Unauthorized, invalid token");
        return null;
      }
    })) as DecodedIdToken;

  logger.info("Token verified");

  return { decodedToken };
};
