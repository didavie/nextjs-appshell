"use client";
import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Text,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  Box,
  useToast,
} from "@chakra-ui/react";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { EyeCheck, EyeOff } from "tabler-icons-react";
// import { defaultColor } from "config/colors";
import useAppRouter from "@/hooks/useAppRouter";
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { useAuth, useFirestore } from "reactfire";
import { doc, getDoc, query, addDoc, collection } from "firebase/firestore";
import { useSigninCheck } from "reactfire";
import { Dictionary } from "get-dictionary";
import { Locale } from "i18n-config";
import { FcGoogle } from "react-icons/fc";
import { UserCollectionRef } from "@/models/models";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { userApi } from "@/components/api/user";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Divider } from "@mantine/core";
import { useInterval } from "@mantine/hooks";

const LoginData = ({
  params: { lang, dictionary },
}: {
  params: {
    lang: Locale;
    dictionary: Dictionary;
  };
}) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [password, setPassword] = React.useState("");
  const [username, setusername] = React.useState("");
  const [isErrored, setIsErrored] = React.useState(false);
  const router = useAppRouter();
  const auth = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const { status, data: signinResult } = useSigninCheck();
  const [openSendPasswordResetEmailModal, setOpenSendPasswordResetEmailModal] =
    React.useState(false);
  const dispatch = useAppDispatch();
  const [seconds, setSeconds] = useState(0);

  const interval = useInterval(() => setSeconds((s) => s + 1), 1000);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      setIsLoading(false);
    } catch (error) {
      setIsErrored(true);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      await signInWithRedirect(auth, provider);
      localStorage.setItem("googleSignIn", "true");
    } catch (error) {
      setIsErrored(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (signinResult?.signedIn && status === "success") {
      router.push(`/${lang}`);
    }
    console.log(signinResult);
  }, [signinResult]);

  useEffect(() => {
    const isGoogleSignIn = localStorage.getItem("googleSignIn");
    const googleSignIn = isGoogleSignIn === "true";
    if (!interval.active && googleSignIn) {
      interval.start();
    }
    if (googleSignIn) {
      const handleRedirectResult = async () => {
        try {
          const result = await getRedirectResult(auth).catch((error) => {
            console.log(error);
            return null;
          });
          if (!result) {
            console.log("no result");
            return;
          }
          if (result.user) {
            localStorage.removeItem("googleSignIn");
            interval.stop();
            console.log("result", result);
            const userRef = doc(
              collection(useFirestore(), UserCollectionRef),
              result.user.uid
            );
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
              const p = Math.random().toString(36).substring(7);
              const res = await dispatch(
                userApi.endpoints.signup.initiate({
                  data: {
                    email: result.user.email as string,
                    phoneNumber: "",
                    firstName: result.user?.displayName?.split(
                      " "
                    )[0] as string,
                    lastName: result.user?.displayName?.split(" ")[1] as string,
                    confirmPassword: p,
                    password: p,
                    displayName: result.user.displayName as string,
                  },
                })
              );
            }
            router.push(`/${lang}`);
          }
        } catch (error) {
          console.log(error);
        }
      };
      handleRedirectResult();
    }
  }, [seconds]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          height: "100%",
        }}
      >
        {isErrored && (
          <Alert status="error" marginBottom="20px">
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{dictionary.errorLogin}</AlertDescription>
          </Alert>
        )}
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "start",
            width: "100%",
            paddingLeft: "20px",
          }}
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            marginTop="20px"
            onClick={() => {
              router.push(`/${lang}/user/signup`);
            }}
            style={{
              cursor: "pointer",
            }}
          >
            Welcome!
          </Text>
          <Text
            fontWeight="bold"
            onClick={() => {
              router.push(`/${lang}/user/signup`);
            }}
            style={{
              cursor: "pointer",
            }}
            // make text 10px
            fontSize={12}
          >
            <span>Acceder a Mecofe ou</span>
            <span
              // style={{ color: defaultColor }}
              onClick={() => {
                router.push(`/${lang}/user/signup`);
              }}
            >
              {" "}
              Cree un compte
            </span>
          </Text>
        </Box>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            <InputGroup h="50px" marginBottom={"20px"}>
              <InputLeftAddon
                children="@"
                style={{
                  marginBottom: "20px",
                }}
                fontSize={17}
                fontWeight={400}
                h={"50px"}
              />
              <Input
                placeholder={dictionary.email}
                style={{
                  marginBottom: "20px",
                }}
                fontSize={17}
                fontWeight={400}
                h={"50px"}
                onChange={(e) => setusername(e.target.value.toLowerCase())}
                type="email"
              />
            </InputGroup>
            <InputGroup
              h="50px"
              marginBottom={"20px"}
              style={{
                marginBottom: "20px",
              }}
            >
              <Input
                type={show ? "text" : "password"}
                placeholder={dictionary.password}
                fontSize={17}
                fontWeight={400}
                h={"50px"}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem" h={"50px"}>
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? <EyeOff /> : <EyeCheck />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>
          <Button
            colorScheme="teal"
            style={{
              width: "100%",
            }}
            // backgroundColor={defaultColor}
            onClick={() => {
              handleSubmit();
            }}
            isLoading={isLoading}
            isDisabled={username === "" || password === ""}
          >
            Login
          </Button>
          <Box>
            <Text
              fontSize="sm"
              fontWeight="bold"
              marginTop="20px"
              onClick={() => {
                setOpenSendPasswordResetEmailModal(true);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              {dictionary.forgotPassword}?{" "}
            </Text>
          </Box>
        </div>
        <Divider my="xs" label="OR" labelPosition="center" w={"100vw"} />
        <Box
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <Button
            variant="outline"
            style={{
              width: "100%",
            }}
            leftIcon={<FcGoogle size={20} />}
            onClick={() => {
              handleGoogleSignIn();
            }}
            isLoading={isLoading}
          >
            Continue with Google
          </Button>
        </Box>
      </div>

      <ModalSendPasswordResetEmail
        params={{
          lang,
          dictionary,
          setOpenSendPasswordResetEmailModal,
          openSendPasswordResetEmailModal,
        }}
      />
    </div>
  );
};

const ModalSendPasswordResetEmail = ({
  params: {
    lang,
    dictionary,
    setOpenSendPasswordResetEmailModal,
    openSendPasswordResetEmailModal,
  },
}: {
  params: {
    lang: Locale;
    dictionary: Dictionary;
    setOpenSendPasswordResetEmailModal: (value: boolean) => void;
    openSendPasswordResetEmailModal: boolean;
  };
}) => {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const [isDisabled, setIsDisabled] = React.useState(true);
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await dispatch(
        userApi.endpoints.passwordResetLink.initiate({
          email,
        })
      );
      setOpenSendPasswordResetEmailModal(false);
      const { data } = response as any;
      if (data) {
        toast({
          status: "success",
          description: dictionary.operationSuccess,
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: dictionary.error,
          description: dictionary.operationFailed,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: dictionary.error,
        description: dictionary.operationFailed,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    const isEmailValid = `${email}`.match(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    );
    setIsDisabled(!isEmailValid);
  }, [email]);

  return (
    <Modal
      isOpen={openSendPasswordResetEmailModal}
      onClose={() => setOpenSendPasswordResetEmailModal(false)}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        style={{
          borderRadius: "20px",
          padding: "0",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <ModalHeader>
          <Text
            fontSize="xl"
            fontWeight="bold"
            marginBottom="20px"
            marginTop={5}
          >
            {dictionary.resetPasswordEmail}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginBottom: "20px",
              }}
            >
              <InputGroup h="50px" marginBottom={"20px"}>
                <Input
                  placeholder={dictionary.email}
                  style={{
                    marginBottom: "20px",
                  }}
                  fontSize={17}
                  fontWeight={400}
                  h={"50px"}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  type="email"
                />
              </InputGroup>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            style={{
              width: "100%",
            }}
            // backgroundColor={defaultColor}
            onClick={() => {
              handleSubmit();
            }}
            isLoading={isLoading}
            isDisabled={isDisabled}
          >
            {dictionary.sendEmail}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginData;
