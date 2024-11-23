"use client";
import { collection, query, orderBy } from "firebase/firestore";
import { useFirestore } from "reactfire";
import { BlogCollectionRef } from "@/models/models";
import { useFirestoreCollectionData } from "reactfire";
import { Post } from "@/types/interfaces";
import { Locale } from "i18n-config";
import { Box } from "@chakra-ui/react";
import AhiLoading from "./components/loading";
import { Home } from "tabler-icons-react";
import HomePostCard from "./components/cards/homePostCard";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/redux/store/store";
import { redirect } from "next/navigation";

const Page = async ({ params: { lang } }: { params: { lang: Locale } }) => {
  redirect("/en/mobile");
};

export default Page;
