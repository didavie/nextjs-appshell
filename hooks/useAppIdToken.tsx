import { useIdTokenResult, useSigninCheck, useUser } from "reactfire";
// import { useState, useEffect } from "react";
import { IdTokenResult, User } from "firebase/auth";
// import { idTokenResult, signinCheckResult } from "../redux/actions/users";
// import { useAppDispatch } from "./useAppDispatch";

const DummyUser: User = {
  uid: "",
  displayName: "",
  email: "",
  emailVerified: false,
  isAnonymous: false,
  metadata: {
    creationTime: "",
    lastSignInTime: "",
  },
  phoneNumber: "",
  photoURL: "",
  providerData: [],
  providerId: "",
  tenantId: "",
  refreshToken: "",
  delete: () => Promise.resolve(),
  getIdToken: () => Promise.resolve(""),
  getIdTokenResult: () => Promise.resolve({} as IdTokenResult),
  reload: () => Promise.resolve(),
  toJSON: () => ({}),
};
clearTimeout;

const useAppIdToken = () => {
  const { status, data: signinData } = useSigninCheck();
  const { data: user } = useUser();
//   const dispatch = useAppDispatch();
  const { data: idToken } = useIdTokenResult(user || DummyUser);
//   useEffect(() => {
//     if (signinData?.signedIn) {
//       dispatch(idTokenResult(idToken));
//       dispatch(signinCheckResult(signinData));
//     }
//     console.log("idToken", idToken);
//     console.log("signinData", signinData);
//   }, [signinData, idToken, dispatch]);
  return { claims: idToken };
};

export default useAppIdToken;
