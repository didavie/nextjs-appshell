// const GeoPluginPage = () => {
//   return <>AMT6KeZphETOlRF1XnCc3v6AWsDdzx</>;
// };

// export default GeoPluginPage;

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // return html
  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GeoPlugin</title>
      </head>
      <body>
        <h1>GeoPlugin</h1>
        <p>AMT6KeZphETOlRF1XnCc3v6AWsDdzx</p>
      </body>
    </html>`,

    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    }
  );
}
