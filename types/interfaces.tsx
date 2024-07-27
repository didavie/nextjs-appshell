import { CreatePaymentReturn } from "@nowpaymentsio/nowpayments-api-js/src/actions/create-payment";
import { Locale } from "../i18n-config";

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};
