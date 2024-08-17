"use client";
import React, { useEffect } from "react";
import {
  Input,
  Button,
  Text,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  Box,
  Select,
} from "@chakra-ui/react";

import { EyeCheck, EyeOff, Edit, X } from "tabler-icons-react";
import { defaultColor } from "config/colors";
import useAppRouter from "@/hooks/useAppRouter";
import { useAuth, useFirestore } from "reactfire";
import { useSigninCheck } from "reactfire";
import { Dictionary } from "get-dictionary";
import { Locale } from "i18n-config";
import { doc, getDoc } from "firebase/firestore";
import { countries } from "config/constants";

import { Table, Tbody, Tr, Td, TableContainer } from "@chakra-ui/react";
import { UserCollectionRef } from "models/models";
import { Country, User } from "types/interfaces";
import { userApi } from "@/components/api/user";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useToast } from "@chakra-ui/react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { Spinner } from "@chakra-ui/react";

// page to display and edit user account information
const pageData = ({
  params: { lang, dictionary },
}: {
  params: {
    lang: Locale;
    dictionary: Dictionary;
  };
}) => {
  const { status, data: signInCheckResult } = useSigninCheck();
  const router = useAppRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [editPersonalInfo, setEditPersonalInfo] = React.useState(false);
  const [editAddress, setEditAddress] = React.useState(false);
  const [editPassword, setEditPassword] = React.useState(false);

  const firestore = useFirestore();
  const [country, setCountry] = React.useState<Country | null>(null);
  const [addressCountry, setAddressCountry] = React.useState<Country | null>(
    null
  );

  const [doPasswordUpdate, setDoPasswordUpdate] = React.useState(false);
  const [doPersonalInfoUpdate, setDoPersonalInfoUpdate] = React.useState(false);
  const [doAddressUpdate, setDoAddressUpdate] = React.useState(false);

  const [isLoadingPersonalInfo, setIsLoadingPersonalInfo] =
    React.useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = React.useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = React.useState(false);
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  useEffect(() => {
    let su: User | null = user;
    if (!signInCheckResult?.signedIn && status !== "loading") {
      router.push(`/${lang}/user/login`);
    } else if (signInCheckResult?.signedIn) {
      if (user === null) {
        su = {
          displayName: signInCheckResult.user.displayName || "",
          email: signInCheckResult.user.email || "",
          phoneNumber: signInCheckResult.user.phoneNumber || "",
          id: signInCheckResult.user.uid,
          firstName: signInCheckResult.user.displayName?.split(" ")[0] || "",
          lastName: signInCheckResult.user.displayName?.split(" ")[1] || "",
        };
      }
      const userRef = doc(
        firestore,
        UserCollectionRef,
        signInCheckResult.user.uid
      );
      getDoc(userRef).then((doc) => {
        if (doc.exists()) {
          su = {
            ...su,
            ...doc.data(),
          };
          setCountry(doc.data().country);
          setAddressCountry(doc.data().address?.countryData);
          setUser(su);
        } else {
          su = {
            ...su,
            id: signInCheckResult.user.uid,
          };
          setUser(su);
        }
      });
    }
  }, [signInCheckResult]);

  useEffect(() => {
    if (user && country) {
      setUser({
        ...user,
        country: country,
      });
    }
  }, [country]);

  useEffect(() => {
    if (user && addressCountry) {
      setUser({
        ...user,
        address: {
          ...user?.address,
          countryData: addressCountry,
        },
      });
    }
  }, [addressCountry]);

  useEffect(() => {
    if (user && password) {
      setUser({
        ...user,
        oldPassword: password,
      });
    }
  }, [password]);

  useEffect(() => {
    if (user && newPassword) {
      setUser({
        ...user,
        password: newPassword,
      });
    }
  }, [newPassword]);

  useEffect(() => {
    if (user && confirmPassword) {
      setUser({
        ...user,
        confirmPassword: confirmPassword,
      });
    }
  }, [confirmPassword]);

  useEffect(() => {
    if (doPersonalInfoUpdate) {
      const func = async () => {
        if (!user) return;
        setIsLoadingPersonalInfo(true);
        const result = await dispatch(
          userApi.endpoints.updateUser.initiate({
            id: signInCheckResult?.user?.uid || "",
            data: user,
            updateType: "profile",
          })
        );
        const { data, error } = result as {
          data: User | undefined;
          error: FetchBaseQueryError | SerializedError;
        };
        if (error) {
          toast({
            title: dictionary.error,
            description: dictionary.operationFailed,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
        } else {
          toast({
            description: dictionary.operationSuccess,
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
          setEditPersonalInfo(false);
        }
        setIsLoadingPersonalInfo(false);
        setDoPersonalInfoUpdate(false);
      };
      func();
    }
  }, [doPersonalInfoUpdate]);

  useEffect(() => {
    if (doAddressUpdate) {
      const func = async () => {
        if (!user) return;
        setIsLoadingAddress(true);
        const result = await dispatch(
          userApi.endpoints.updateUser.initiate({
            id: signInCheckResult?.user?.uid || "",
            data: user,
            updateType: "address",
          })
        );
        const { data, error } = result as {
          data: User | undefined;
          error: FetchBaseQueryError | SerializedError;
        };
        if (error) {
          toast({
            title: dictionary.error,
            description: dictionary.operationFailed,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
        } else {
          toast({
            description: dictionary.operationSuccess,
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
          setEditAddress(false);
        }
        setDoAddressUpdate(false);

        setIsLoadingAddress(false);
      };
      func();
    }
  }, [doAddressUpdate]);

  useEffect(() => {
    if (doPasswordUpdate) {
      const func = async () => {
        if (!user) return;
        setIsLoadingPassword(true);
        const result = await dispatch(
          userApi.endpoints.updateUser.initiate({
            id: signInCheckResult?.user?.uid || "",
            data: user,
            updateType: "password",
          })
        );
        const { data, error } = result as {
          data: User | undefined;
          error: FetchBaseQueryError | SerializedError;
        };
        if (error) {
          toast({
            title: dictionary.error,
            description: dictionary.operationFailed,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
        } else {
          toast({
            description: dictionary.operationSuccess,
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
          setEditPassword(false);
        }
        setIsLoadingPassword(false);
        setDoPasswordUpdate(false);
      };
      func();
    }
  }, [doPasswordUpdate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={5}
      width="100%"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        maxW={800}
        margin="auto"
        marginLeft={5}
        marginRight={5}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          w={"100%"}
        >
          <Box>
            <Text fontSize="3xl">{dictionary.personalInfo}</Text>
            <Button
              onClick={() => setEditPersonalInfo(!editPersonalInfo)}
              variant="link"
              size="sm"
              leftIcon={
                isLoadingPersonalInfo ? (
                  <Spinner />
                ) : editPersonalInfo ? (
                  <X />
                ) : (
                  <Edit />
                )
              }
            >
              {editPersonalInfo ? dictionary.cancel : dictionary.Modify}
            </Button>
          </Box>
          <Box
            display={editPersonalInfo ? "none" : "block"}
            justifyContent="flex-start"
            w={"100%"}
          >
            <TableContainer>
              <Table variant="simple">
                <Tbody>
                  <Tr>
                    <Td
                      // break-word
                      whiteSpace={"pre-wrap"}
                      wordBreak={"break-word"}
                    >
                      {dictionary.firstName}
                    </Td>
                    <Td
                      // break-word
                      whiteSpace={"pre-wrap"}
                      wordBreak={"break-word"}
                    >
                      {user?.displayName && user.displayName.split(" ")[0]}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      // break-word
                      whiteSpace={"pre-wrap"}
                      wordBreak={"break-word"}
                    >
                      {dictionary.lastName}
                    </Td>
                    <Td
                      // break-word
                      whiteSpace={"pre-wrap"}
                      wordBreak={"break-word"}
                    >
                      {user?.displayName && user.displayName.split(" ")[1]}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      // break-word
                      whiteSpace={"pre-wrap"}
                      wordBreak={"break-word"}
                    >
                      {dictionary.email}
                    </Td>
                    <Td
                      // break-word
                      whiteSpace={"pre-wrap"}
                      wordBreak={"break-word"}
                    >
                      {user?.email}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      // break-word
                      whiteSpace={"pre-wrap"}
                      wordBreak={"break-word"}
                    >
                      Pays
                    </Td>
                    <Td
                      // break-word
                      whiteSpace={"pre-wrap"}
                      wordBreak={"break-word"}
                    >
                      {user && user?.country && user?.country?.name}{" "}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          {/* inouts to modify */}
          <Box
            display={editPersonalInfo ? "block" : "none"}
            justifyContent="flex-start"
            w={"100%"}
          >
            <InputGroup mb={2}>
              <Input
                placeholder={dictionary.firstName}
                value={
                  (user?.displayName && user.displayName.split(" ")[0]) || ""
                }
                onChange={(e) => {
                  const name = e.target.value;
                  setUser({
                    ...user,
                    displayName: name + " " + user?.displayName?.split(" ")[1],
                    firstName: name,
                  });
                }}
              />
            </InputGroup>
            <InputGroup mb={2}>
              <Input
                placeholder={dictionary.lastName}
                value={
                  (user?.displayName && user.displayName.split(" ")[1]) || ""
                }
                onChange={(e) => {
                  const name = e.target.value;
                  setUser({
                    ...user,
                    displayName: user?.displayName?.split(" ")[0] + " " + name,
                    lastName: name,
                  });
                }}
              />
            </InputGroup>
            <InputGroup mb={2}>
              <Input
                placeholder={dictionary.email}
                value={user?.email || ""}
                onChange={(e) => {
                  setUser({
                    ...user,
                    email: e.target.value,
                  });
                }}
              />
            </InputGroup>

            <Select
              placeholder={country?.name || "Pays"}
              onChange={(e) => {
                const country = countries.find(
                  (country) => country.code === e.target.value
                );
                if (country) setCountry(country);
              }}
              mb={2}
              value={country?.name}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </Select>

            <Button
              colorScheme="blue"
              variant={"outline"}
              onClick={() => {
                setDoPersonalInfoUpdate(true);
              }}
              isLoading={isLoadingPersonalInfo}
            >
              {dictionary.save}
            </Button>
          </Box>
        </Box>
        <Box mt={10} w={"100%"} mb={"60px"}>
          <Box>
            <Text fontSize="3xl">{dictionary.changePassword}</Text>
            <Button
              onClick={() => setEditPassword(!editPassword)}
              variant="link"
              size="sm"
              leftIcon={
                isLoadingPassword ? (
                  <Spinner />
                ) : editPassword ? (
                  <X />
                ) : (
                  <Edit />
                )
              }
            >
              {editPassword ? "Annuler" : "Modifier"}
            </Button>
          </Box>
          <Box
            display={editPassword ? "block" : "none"}
            justifyContent="flex-start"
            w={"100%"}
          >
            <InputGroup mb={2}>
              <InputRightElement>
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? <EyeOff /> : <EyeCheck />}
                </Button>
              </InputRightElement>
              <Input
                placeholder={dictionary.oldPassword}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={show ? "text" : "password"}
              />
            </InputGroup>
            <InputGroup mb={2}>
              <Input
                placeholder={dictionary.newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                type={show ? "text" : "password"}
              />
              <InputRightElement>
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? <EyeOff /> : <EyeCheck />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <InputGroup mb={2}>
              <Input
                placeholder={dictionary.confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                type={show ? "text" : "password"}
              />
              <InputRightElement>
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? <EyeOff /> : <EyeCheck />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button
              colorScheme="blue"
              variant={"outline"}
              onClick={() => {
                setDoPasswordUpdate(true);
              }}
              isLoading={isLoadingPassword}
            >
              {dictionary.save}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default pageData;
