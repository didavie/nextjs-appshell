import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { admin, db } from "../../../config/firebase";
import { logger } from "firebase-functions/v1";

export async function POST(request: NextRequest) {
  // try {
    // increase the visit count
    // get the latest visit id
    // const visiteRef = await db
  //     .collection(VisiteCollectionRef)
  //     .orderBy("createdAt", "desc")
  //     .limit(1)
  //     .get();
  //   const visiteData = visiteRef.docs[0].data();
  //   if (!visiteData) {
  //     // add a new visit
  //     await db.collection(VisiteCollectionRef).add({
  //       count: 1,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     });
  //     return NextResponse.json({ count: 1 });
  //   }
  //   // check if we at the same day
  //   const curTime = new Date();
  //   const lastTime = new Date(visiteData.createdAt);
  //   if (
  //     curTime.getDate() === lastTime.getDate() &&
  //     curTime.getMonth() === lastTime.getMonth() &&
  //     curTime.getFullYear() === lastTime.getFullYear()
  //   ) {
  //     // update the visit count
  //     const count = visiteData.count + 1;
  //     await db
  //       .collection(VisiteCollectionRef)
  //       .doc(visiteRef.docs[0].id)
  //       .update({
  //         count,
  //         updatedAt: new Date().toISOString(),
  //       });
  //     return NextResponse.json({ count });
  //   } else {
  //     // add a new visit
  //     await db.collection(VisiteCollectionRef).add({
  //       count: 1,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     });
  //     return NextResponse.json({ count: 1 });
  //   }
  // } catch (error) {
  //   logger.error(error);
  //   return NextResponse.json(
  //     { error: "Internal server error" },
  //     { status: 500 }
  //   );
  // }
}
