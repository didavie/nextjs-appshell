"use client";
import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Container,
  Text,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  Select,
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
import { defaultColor } from "config/colors";
import useAppRouter from "@/hooks/useAppRouter";
import { useAuth, useFirestore, useSigninCheck } from "reactfire";
import { Dictionary } from "get-dictionary";
import { Locale } from "i18n-config";
import { userApi } from "@/components/api/v1/user";
import { User } from "next-auth";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Divider } from "@mantine/core";
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useInterval } from "@mantine/hooks";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { countries } from "config/constants";
import { Country } from "types/interfaces";

const PageData = ({
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
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [error, setError] = React.useState("");
  const [isErrored, setIsErrored] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const router = useAppRouter();
  const { status, data: signinResult } = useSigninCheck();
  const toast = useToast();
  const auth = useAuth();
  const [seconds, setSeconds] = useState(0);
  const interval = useInterval(() => setSeconds((s) => s + 1), 1000);

  const dispatch = useAppDispatch();
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(
        userApi.endpoints.signup.initiate({
          data: {
            email,
            password,
            phoneNumber,
            firstName,
            lastName,
            country: countries.find((c) => c.code === country) as Country,
            confirmPassword,
            displayName: `${firstName} ${lastName}`,
          },
        })
      );
      const { error, data } = res as {
        error: SerializedError | FetchBaseQueryError;
        data: User | undefined;
      };
      if (error) {
        setIsErrored(true);
        toast({
          title: dictionary.error,
          description: dictionary.errorSignUp,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          description: dictionary.successSignUp,
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        router.push(`/${lang}/user/login`);
      }
    } catch (error) {
      toast({
        title: dictionary.error,
        description: dictionary.errorSignUp,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      setIsErrored(true);
    }
  };

  useEffect(() => {
    const isEmailValid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (
      password !== confirmPassword ||
      confirmPassword == "" ||
      password == "" ||
      confirmPassword.length < 6 ||
      password.length < 6 ||
      email == "" ||
      firstName == "" ||
      firstName.length < 2 ||
      lastName == "" ||
      lastName.length < 2 ||
      isEmailValid
    ) {
      setIsDisabled(true);
      // setIsErrored(true);
    } else {
      setIsDisabled(false);
      setError("");
      // setIsErrored(false);
    }
  }, [
    password,
    confirmPassword,
    email,
    phoneNumber,
    firstName,
    lastName,
    country,
  ]);
  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      await signInWithRedirect(auth, provider);
      localStorage.setItem("googleSignIn", "true");
      interval.start();
    } catch (error) {
      setIsErrored(true);
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (signinResult?.signedIn) {
      router.push(`/${lang}/mobile`);
    }
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
            const p = Math.random().toString(36).substring(7);
            const res = await dispatch(
              userApi.endpoints.signup.initiate({
                data: {
                  email: result.user.email as string,
                  phoneNumber: "",
                  firstName: result.user?.displayName?.split(" ")[0] as string,
                  lastName: result.user?.displayName?.split(" ")[1] as string,
                  confirmPassword: p,
                  password: p,
                  displayName: result.user.displayName as string,
                },
              })
            );
            const { error, data } = res as {
              error: SerializedError | FetchBaseQueryError;
              data: User | undefined;
            };
            if (error) {
              setIsErrored(true);
              toast({
                title: dictionary.error,
                description: dictionary.errorSignUp,
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "top",
              });
            } else {
              toast({
                description: dictionary.successSignUp,
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top",
              });
              router.push(`/${lang}/user/login`);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      handleRedirectResult();
    }
  }, [seconds]);

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box marginBottom="20px" padding="10px">
          <Box marginLeft={"20px"}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              marginTop="20px"
              onClick={() => {
                router.push(`/${lang}/user/login`);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <span>{dictionary.alreadyHaveAccount}</span>
              <span
                style={{
                  marginLeft: "5px",
                }}
              >
                {dictionary.login}
              </span>
            </Text>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              height: "100%",
            }}
          >
            {isErrored && (
              <Alert status="error" marginBottom="20px">
                <AlertIcon />
                <AlertTitle mr={2}>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
                padding: "10px",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  width: "100%",
                  marginBottom: "20px",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <InputGroup
                    h="40px"
                    marginBottom={"20px"}
                    marginRight={"10px"}
                  >
                    <Input
                      placeholder={dictionary.firstName}
                      style={{
                        marginBottom: "20px",
                      }}
                      fontSize={"1rem"}
                      fontWeight={400}
                      h={"40px"}
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                    />
                  </InputGroup>
                  <InputGroup
                    h="40px"
                    marginBottom={"20px"}
                    marginLeft={"10px"}
                  >
                    <Input
                      placeholder={dictionary.lastName}
                      style={{
                        marginBottom: "20px",
                      }}
                      fontSize={"1rem"}
                      fontWeight={400}
                      h={"40px"}
                      onChange={(e) => setLastName(e.target.value)}
                      type="text"
                    />
                  </InputGroup>
                </Box>

                <InputGroup h="40px" marginBottom={"20px"}>
                  <Input
                    placeholder={dictionary.email}
                    style={{
                      marginBottom: "20px",
                    }}
                    fontSize={"1rem"}
                    fontWeight={400}
                    h={"40px"}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </InputGroup>

                <InputGroup
                  h="40px"
                  marginBottom={"20px"}
                  display={country === "" ? "none" : "flex"}
                >
                  <InputLeftAddon
                    children={`${
                      countries.find((c) => c.code === country)?.dial_code
                    }`}
                    style={{
                      marginBottom: "20px",
                    }}
                    fontSize={"1rem"}
                    fontWeight={400}
                    h={"40px"}
                  />
                  <Input
                    placeholder={dictionary.phone}
                    style={{
                      marginBottom: "20px",
                    }}
                    fontSize={"1rem"}
                    fontWeight={400}
                    h={"40px"}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="tel"
                  />
                </InputGroup>
                <InputGroup
                  h="40px"
                  marginBottom={"20px"}
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <Input
                    type={show ? "text" : "password"}
                    placeholder={dictionary.password}
                    fontSize={"1rem"}
                    fontWeight={400}
                    h={"40px"}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem" h={"40px"}>
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? <EyeOff /> : <EyeCheck />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <InputGroup
                  h="40px"
                  marginBottom={"20px"}
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <Input
                    type={show ? "text" : "password"}
                    placeholder={dictionary.confirmPassword}
                    fontSize={"1rem"}
                    fontWeight={400}
                    h={"40px"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem" h={"40px"}>
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? <EyeOff /> : <EyeCheck />}
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <Text fontSize="sm" marginTop="10px" align="left">
                  {dictionary.passwordLength}
                </Text>
              </Box>

              <Button
                colorScheme="teal"
                style={{
                  width: "100%",
                }}
                onClick={() => {
                  handleSubmit();
                }}
                isLoading={isLoading}
                isDisabled={isDisabled}
              >
                {dictionary.signUp}
              </Button>
            </Box>
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
                  handleGoogleSignUp();
                }}
                isLoading={isLoading}
              >
                Continue with Google
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PageData;
