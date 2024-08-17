"use client";
import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputRightElement,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import {
  defaultColor,
  defaultColorDark,
  defaultColorHover,
} from "config/colors";
import { IoIosNotificationsOutline } from "react-icons/io";

import { MenuModal } from "./navElements";
import { ChevronDown, ShoppingCart } from "tabler-icons-react";
import useAppRouter from "@/hooks/useAppRouter";
import { CloseIcon, HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import { use, useEffect, useState } from "react";
import { useAuth, useSigninCheck, useUser } from "reactfire";
import useAppIdToken from "hooks/useAppIdToken";
import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { useFirestore } from "reactfire";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { usePathname } from "next/navigation";

import { Api } from "@/redux/api/api";
import { Locale } from "i18n-config";
import { useHeadroom, useInterval } from "@mantine/hooks";
import { IconMapPin } from "@tabler/icons-react";
import { rem } from "@mantine/core";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { ParsedToken } from "firebase/auth";
import { Breakpoints } from "@/config/ui";
import { FontSizeXS, FontSizeXXS, FontSizeXXXS } from "@/config/styling";

const Navbar = ({ lang, dictionary }: { lang: Locale; dictionary: any }) => {
  const router = useAppRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useAppDispatch();
  const { status, data: signinResult } = useSigninCheck();
  const { data: user } = useUser();
  const { claims } = useAppIdToken();
  const [uClaims, setClaims] = useState<ParsedToken>({
    role: "shopper",
  });
  const pathname = usePathname();
  const firestore = useFirestore();
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const paths = usePathname();
  const [currentPathLang, setCurrentPathLang] = useState("");
  const toast = useToast();
  const [seconds, setSeconds] = useState(0);
  const interval = useInterval(() => setSeconds((s) => s + 1), 1000);

  const [openSelectCountryModal, setOpenSelectCountryModal] = useState(false);
  const pinned = useHeadroom({ fixedAt: 120 });
  const [getLocationsData, setGetLocationsData] = useState<any>(null);
  const auth = useAuth();
  const [isMobile] = useMediaQuery(`(max-width: ${Breakpoints.sm}px)`);

  useEffect(() => {
    if (status !== "success" || !signinResult?.signedIn) {
      return;
    }
    const Func = async () => {
      const result = await auth.currentUser?.getIdTokenResult();
      if (result) {
        setClaims(result?.claims);
      }
    };
    Func();
  }, [status]);

  useEffect(() => {
    interval.start();
    return () => {
      interval.stop();
    };
  }, []);

  useEffect(() => {
    const pathComponents = paths.split("/").slice(1);
    setCurrentPathLang(pathComponents[0]);
  }, [paths]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          backgroundColor: defaultColor,
          color: "black",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          // minHeight: MobileNavHeight,
          paddingBottom: 5,
          transform: `translate3d(0, ${pinned ? 0 : rem(-110)}, 0)`,
          transition: "transform 400ms ease",
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="100vw"
          minWidth={isMobile ? "100vw" : Breakpoints.lg}
          maxW={isMobile ? "100%" : Breakpoints.lg}
          margin={"auto"}
          mr={isMobile ? 5 : "auto"}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            border={"solid"}
            borderColor="gray.400"
            borderRadius={10}
            borderWidth={1}
            // padding={1}
            pl={2}
            pr={2}
            onClick={() => {
              router.push(`/${currentPathLang}`);
            }}
          >
            <Text
              fontSize={20}
              fontWeight={800}
              style={{
                fontFamily: "cursive,'Emilys Candy', serif",
              }}
            >
              Mecofe
            </Text>
            <Text
              mt={-2}
              fontSize={10}
              fontWeight={700}
              textTransform="uppercase"
            >
              Learn
            </Text>
          </Box>

          <Box
            display="flex"
            justifyContent="left"
            alignItems="flex-start"
            width="100%"
            margin={"auto"}
          >
            <InputGroup maxW={isMobile ? "100%" : "60%"} marginLeft={2}>
              <InputLeftAddon
                h={"40px"}
                w={"40px"}
                onClick={() => {
                  setOpenSearchModal(true);
                }}
              >
                <SearchIcon color="gray.900" />
              </InputLeftAddon>
              <Input
                placeholder={isMobile ? "" : "Search"}
                variant="filled"
                margin="auto"
                h={"40px"}
                onClick={() => {
                  setOpenSearchModal(true);
                }}
                // do not b
              />
              <InputRightElement h={"40px"} w={"fit-content"} padding={2}>
                <Text
                  fontSize={isMobile ? FontSizeXXS : FontSizeXS}
                  color={"gray.600"}
                  cursor="pointer"
                  opacity={0.8}
                  // do not break this line
                  wordBreak={"break-word"}
                  whiteSpace={"nowrap"}
                  onClick={() => {
                    // router.push(
                    //   `/${currentPathLang}/user/resume/K8so0Nf2dWSUvcls5gkgELLk0Um1`
                    // );
                  }}
                  // giggle the text every 2 seconds
                  transform={`rotate(${seconds % 2 === 0 ? 3 : -3}deg)`}
                >
                  Made by Coovi Meha
                </Text>
              </InputRightElement>
            </InputGroup>
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              display={!isMobile ? "flex" : "none"}
              justifyContent="center"
              alignItems="center"
              margin="10px"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <Button fontSize={12} textTransform="capitalize" variant="solid">
                Create account
              </Button>
            </Box>
            <Box
              style={{
                display: isMobile ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                margin: "10px",
              }}
              onClick={() => {
                setOpenDrawer(!openDrawer);
              }}
            >
              <Box pr={2}>
                <IoIosNotificationsOutline size={30} />
              </Box>
              <Box>
                {openDrawer ? (
                  <CloseIcon w={7} h={7} />
                ) : (
                  <HamburgerIcon w={7} h={7} />
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <NavItemMenuMobile />
      </nav>
      <SearchModal
        openSearchModal={openSearchModal}
        setOpenSearchModal={setOpenSearchModal}
      ></SearchModal>
      <MenuModal
        setOpen={setOpenDrawer}
        isOpen={openDrawer}
        dictionary={dictionary}
        lang={lang}
      />
      {/* <SelectCountryModal
        openSelectCountryModal={openSelectCountryModal}
        setOpenSelectCountryModal={setOpenSelectCountryModal}
        setCountryOfDelivery={setCountryOfDelivery}
      ></SelectCountryModal> */}
    </>
  );
};

export const NavItemMenuMobile = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const router = useAppRouter();
  const currentPath = usePathname();
  const [currentPathLang, setCurrentPathLang] = useState("en");

  useEffect(() => {
    const pathComponents = currentPath.split("/").slice(1);
    setCurrentPathLang(pathComponents[0]);
  }, [currentPath]);

  return (
    <Box
      display={isMobile ? "flex" : "none"}
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      flexWrap="nowrap"
      width="100%"
      left={0}
      right={0}
      overflowX={"auto"}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      userSelect={"none"}
    >
      <Box
        display="flex"
        width="100%"
        maxWidth={800}
        margin="auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* {NavElements.map((element: any, index) => (
          <Text
            key={index}
            fontSize="12px"
            fontWeight="bold"
            padding={2}
            cursor="pointer"
            onClick={() => {
              // normalize the path to remove accents and spaces and special characters
              const path = element.title["fr"];
              const normalizedPath = path
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s/g, "-");
              router.push(`/${currentPathLang}/market/${normalizedPath}`);
            }}
            opacity={0.8}
          >
            {element.title[currentPathLang]}
          </Text>
        ))} */}
      </Box>
    </Box>
  );
};

export default Navbar;

const SearchModal = ({
  openSearchModal,
  setOpenSearchModal,
}: {
  openSearchModal: boolean;
  setOpenSearchModal: Function;
}) => {
  const [search, setSearch] = useState("");
  // const [previewResults, setPreviewResults] = useState<Item[]>([]);
  const [doSearch, setDoSearch] = useState(false);
  // const [itemSelected, setItemSelected] = useState<Item | null>(null);
  const router = useAppRouter();
  const firestore = useFirestore();
  // const itemsCollectionRef = collection(firestore, ItemCollectionRef);
  const [searching, setSearching] = useState(false);
  const [currentPathLang, setCurrentPathLang] = useState("en");
  const currentPath = usePathname();

  useEffect(() => {
    const pathComponents = currentPath.split("/").slice(1);
    setCurrentPathLang(pathComponents[0]);
  }, [currentPath]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (search === "") {
  //       // setPreviewResults([]);
  //       return;
  //     } else if (search.length < 3) {
  //       // setPreviewResults([]);
  //       return;
  //     }
  //     // try capitalizing first letter
  //     if (searching) {
  //       return;
  //     }
  //     let data: Item[] = [];
  // setSearching(true);
  // const q = query(
  //   itemsCollectionRef,
  //   where("isHidden", "==", false),
  //   orderBy("title"),
  //   where("title", ">=", search),
  //   where("title", "<=", search + "\uf8ff"),
  //   limit(20)
  // );
  // const querySnapshot = await getDocs(q);
  // data = querySnapshot.docs.map((doc) => doc.data() as Item);
  // if (data.length === 0) {
  //   // try with lowercase search
  //   const q = query(
  //     itemsCollectionRef,
  //     where("isHidden", "==", false),
  //     orderBy("title"),
  //     where("title", ">=", search.toLowerCase()),
  //     where("title", "<=", search.toLowerCase() + "\uf8ff"),
  //     limit(20)
  //   );
  //   const querySnapshot = await getDocs(q);
  //   data = querySnapshot.docs.map((doc) => doc.data() as Item);
  // }
  // if (data.length === 0) {
  // try with uppercase search
  //   const q = query(
  //     itemsCollectionRef,
  //     where("isHidden", "==", false),
  //     orderBy("title"),
  //     where("title", ">=", search[0].toUpperCase() + search.slice(1)),
  //     where(
  //       "title",
  //       "<=",
  //       search[0].toUpperCase() + search.slice(1) + "\uf8ff"
  //     ),
  //     limit(20)
  //   );
  //   const querySnapshot = await getDocs(q);
  //   data = querySnapshot.docs.map((doc) => doc.data() as Item);
  // }
  // setPreviewResults(data);
  //     setSearching(false);
  //   };
  //   fetchData();
  // }, [search]);

  // useEffect(() => {
  //   if (doSearch && itemSelected) {
  //     router.push(
  //       `/${currentPathLang}/search/specific/${itemSelected.category}/${itemSelected.type}`
  //     );
  //   } else if (doSearch) {
  //     router.push(`/${currentPathLang}/search/general/find/${search}`);
  //   }
  // }, [doSearch, itemSelected]);

  return (
    <Modal
      isOpen={openSearchModal}
      onClose={() => {
        setOpenSearchModal(false);
        // setPreviewResults([]);
      }}
    >
      <ModalOverlay />
      <ModalContent w={"100vw"}>
        <ModalBody maxH={"80vh"} overflowY={"auto"}>
          <InputGroup padding={2}>
            <InputLeftAddon pointerEvents="none" margin={"auto"}>
              <SearchIcon color="gray.300" h={"30px"} w={"30px"} />
            </InputLeftAddon>
            <Input
              placeholder="Search"
              variant="filled"
              size="lg"
              // width="100%"
              maxWidth={800}
              margin="auto"
              h={"40px"}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setOpenSearchModal(false);
                  setDoSearch(true);
                }
              }}
            />
          </InputGroup>
          {/* {previewResults.length > 0 && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="start"
              width="100%"
              maxWidth={800}
              margin="auto"
              padding={2}
            >
              {previewResults.map((item, index) => (
                <Box
                  // href={`/market/${item.category}/${item.id}`}
                  key={index}
                  onClick={() => {
                    setOpenSearchModal(false);
                  }}
                  borderRadius={5}
                  boxShadow="0 0 5px rgba(0,0,0,0.1)"
                  // padding={1}
                  margin={2}
                  width="100%"
                >
                  <Box
                    w={"100%"}
                    onClick={() => {
                      setOpenSearchModal(false);
                      setItemSelected(item);
                      setDoSearch(true);
                    }}
                    // when hovering, change background color
                    _hover={{
                      backgroundColor: defaultColor,
                      cursor: "pointer",
                      color: "white",
                      fontWeight: 800,
                      borderRadius: 5,
                    }}
                    padding={2}
                  >
                    <Text>
                      {item.translated &&
                      item.translated.title &&
                      item.translated.title[currentPathLang as Locale].length >
                        30
                        ? item.translated.title[
                            currentPathLang as Locale
                          ].slice(0, 30) + "..."
                        : item.translated?.title[currentPathLang as Locale]}
                    </Text>
                    <Text opacity={0.5}>
                      {item.translated?.category && item.translated?.type
                        ? item.translated?.category[currentPathLang as Locale] +
                          " - " +
                          item.translated.type[currentPathLang as Locale]
                        : item.translated?.category[currentPathLang as Locale]}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          )} */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const SelectCountryModal = ({
  openSelectCountryModal,
  setOpenSelectCountryModal,
  setCountryOfDelivery,
}: {
  openSelectCountryModal: boolean;
  setOpenSelectCountryModal: Function;
  setCountryOfDelivery: Function;
}) => {
  return (
    <Modal
      isOpen={openSelectCountryModal}
      onClose={() => {
        setOpenSelectCountryModal(false);
      }}
    >
      <ModalOverlay />
      <ModalContent margin={"auto"}>
        <ModalBody
          padding={2}
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="start"
        >
          <Box
            margin="auto"
            maxH={"80vh"}
            overflowY={"auto"}
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="start"
          >
            {/* {countries.map((country: Country, index: number) => (
              <Box
                key={index}
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={2}
                onClick={() => {
                  setCountryOfDelivery(country);
                  setOpenSelectCountryModal(false);
                }}
                _hover={{
                  backgroundColor: defaultColor,
                  cursor: "pointer",
                  color: "white",
                  fontWeight: 800,
                  borderRadius: 5,
                }}
              >
                <Text>{country.name}</Text>
              </Box>
            ))} */}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
