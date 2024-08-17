import { userApi } from "@/components/api/user";
import AhiLoading from "@/components/loading";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { UserCollectionRef } from "@/models/models";
import { getRedirectResult } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import { Locale } from "i18n-config";
import useAppRouter from "@/hooks/useAppRouter";
import { useAuth, useFirestore } from "reactfire";

const LoginRedirect = ({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const router = useAppRouter();
  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth).catch((error) => {
        router.push(`${lang}/users/login`);
        return null;
      });
      if (!result) {
        console.log("no result");
        return;
      }
      if (result.user) {
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
                firstName: result.user?.displayName?.split(" ")[0] as string,
                lastName: result.user?.displayName?.split(" ")[1] as string,
                confirmPassword: p,
                password: p,
                displayName: result.user.displayName as string,
              },
            })
          );
        }
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleRedirectResult();

  return <AhiLoading />;
};

export default LoginRedirect;
