import { NextRequest, NextResponse } from "next/server";
import { admin, db } from "@/config/firebase";
import { PostCollectionRef, SiteMapCollectionRef } from "@/models/models";
import { Post } from "@/types/interfaces";
import { FieldValue, QuerySnapshot } from "firebase-admin/firestore";

// handler sitemap.xml
export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string; device: string } }
) {
  const headers = new Headers(request.headers);
  const ssrUrl = headers.get("x-forwarded-host") || headers.get("x-url") || "";
  const sitemapRef = db.collection(SiteMapCollectionRef).doc("sitemap");
  const sitemapData = await sitemapRef.get();
  let items: QuerySnapshot<Post> | undefined;
  let itemsArrayData: {
    id: string | undefined;
  }[] = [];
  const data = sitemapData.data();
  if (sitemapData.exists && data) {
    itemsArrayData = data.items || [];
    // get newly added items
    const itemsRef = db.collection(PostCollectionRef);
    items = await itemsRef.where("createdAt", ">", data.lastmod).get();
    const itData = items.docs.map((docD) => {
      const item = docD.data();
      return {
        id: item.id,
      };
    });
    itemsArrayData = [
      ...itemsArrayData,
      ...itData.map((item) => {
        return {
          id: item.id,
        };
      }),
    ];
    // update sitemap
    if (itData.length > 0)
      await sitemapRef
        .update({
          lastmod: new Date(),
          items: FieldValue.arrayUnion(...itData),
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
  } else {
    items = await db.collection(PostCollectionRef).get();
    itemsArrayData = items.docs.map((docD) => {
      const item = docD.data();
      return {
        id: item.id,
      };
    });
    // update sitemap
    await sitemapRef
      .set(
        {
          lastmod: new Date(),
          items: itemsArrayData,
        },
        { merge: true }
      )
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
  let itemsArray: {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: number;
  }[] = [];
  if (!items || items.empty) {
    itemsArray = [];
  } else {
    itemsArray = itemsArrayData.map((item: Post) => {
      return {
        loc: `https://${ssrUrl}/${params.lang}/${params.device}/post/view/${item.id}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      };
    });
  }

  //   categories
  itemsArray = itemsArray.concat(
    itemsArrayData.map((item: Post) => {
      return {
        loc: `https://${ssrUrl}/${params.lang}/${params.device}/post/view/${item.id}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      };
    })
  );

  //   groups
  itemsArray = itemsArray.concat(
    itemsArrayData.map((item: Post) => {
      return {
        loc: `https://${ssrUrl}/${params.lang}/${params.device}/post/view/${item.id}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      };
    })
  );

  // add type
  itemsArray = itemsArray.concat(
    itemsArrayData.map((item: Post) => {
      return {
        loc: `https://${ssrUrl}/${params.lang}/${params.device}/post/view/${item.id}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      };
    })
  );

  //   add root
  itemsArray.push({
    loc: `https://${ssrUrl}/${params.lang}/${params.device}`,
    lastmod: new Date().toISOString(),
    changefreq: "weekly",
    priority: 0.7,
  });

  // static pages
  const staticPagesArray = [
    // {
    //   loc: `https://${ssrUrl}/${params.lang}/${params.device}/company/about`,
    //   lastmod: new Date().toISOString(),
    // },
    // {
    //   loc: `https://${ssrUrl}/${params.lang}/${params.device}/company/contact`,
    //   lastmod: new Date().toISOString(),
    // },
    // {
    //   loc: `https://${ssrUrl}/${params.lang}/${params.device}/company/terms`,
    //   lastmod: new Date().toISOString(),
    // },
    // {
    //   loc: `https://${ssrUrl}/${params.lang}/${params.device}/company/privacy`,
    //   lastmod: new Date().toISOString(),
    // },
    // // login
    // {
    //   loc: `https://${ssrUrl}/${params.lang}/${params.device}/user/login`,
    //   lastmod: new Date().toISOString(),
    // },
    // // register
    // {
    //   loc: `https://${ssrUrl}/${params.lang}/${params.device}/user/signup`,
    //   lastmod: new Date().toISOString(),
    // },
    // {
    //   loc: `https://${ssrUrl}/${params.lang}/${params.device}/user/account`,
    //   lastmod: new Date().toISOString(),
    // },
    {
      loc: `https://${ssrUrl}`,
      lastmod: new Date().toISOString(),
    },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${itemsArray
      .map(
        (item) => `
      <url>
        <loc>${item.loc}</loc>
        <lastmod>${item.lastmod}</lastmod>
        <changefreq>${item.changefreq}</changefreq>
        <priority>${item.priority}</priority>
      </url>
    `
      )
      .join("")}
    ${staticPagesArray
      .map(
        (item) => `
      <url>
        <loc>${item.loc}</loc>
        <lastmod>${item.lastmod}</lastmod>
      </url>
    `
      )
      .join("")}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
