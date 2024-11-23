import axios from "axios";
import { logger } from "firebase-functions/v1";
import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("X-User-Identity");
  if (!ip) {
    logger.error("IP address not found");
    return NextResponse.json(
      { error: "IP address not found" },
      { status: 400 }
    );
  }
  const response = await axios.get(`http://www.geoplugin.net/json.gp?ip=${ip}`);
  const data = response.data;
  return NextResponse.json(data);
}
