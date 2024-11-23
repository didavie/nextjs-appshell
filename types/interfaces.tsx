import { CreatePaymentReturn } from "@nowpaymentsio/nowpayments-api-js/src/actions/create-payment";
import { Locale } from "i18n-config";

export interface User {
  id?: string;
  email?: string;
  displayName?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  oldPassword?: string;
  photoURL?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: UserRoles;
  status?: UserStatus;
  isVerified?: boolean;
  country?: Country;
  address?: Address;
  currency?: string;
  resume?: Resume;
  roles?: string[];
  roleId?: number;
  rolesId?: number[];
}

export interface Resume {
  id?: string;
  content?: string;
  contentType?: string;
  translated?: {
    content: {
      [key in Locale]: string;
    };
  };
}
export type UserStatus =
  | "active"
  | "inactive"
  | "banned"
  | "deleted"
  | "disabled"
  | "blocked";

export type UserRoles =
  | "user"
  | "admin"
  | "superadmin"
  | "shopper"
  | "seller"
  | "tester"
  | "gguest";

export interface ImgBBBlob {
  id: string;
  title: string;
  url_viewer: string;
  url: string;
  display_url: string;
  size: number;
  time: string;
  expiration: string;
  width: number;
  height: number;
  image: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  thumb: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  medium: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  delete_url: string;
}

export interface imgCategory {
  index: number;
  size: string;
}

export interface Translated {
  category: {
    [key in Locale]: string;
  };
  type: {
    [key in Locale]: string;
  };
  title: {
    [key in Locale]: string;
  };
  description: {
    [key in Locale]: string;
  };
  tags: {
    [key in Locale]: string;
  };
}
export interface Post {
  id?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: {
    id: string;
    name: string;
    photoURL: string;
  };
  data?: {
    content?: string;
    category?: string;
    tags?: string;
    types?: string;
    description?: string;
    keywords?: string[];
    headers?: string[];
    title?: string;
    searchKeywords?: string;
  };
  translated?: Translated;
  likes?: number;
  views?: number;
  viwers?: string[];
}

export interface Info {
  category: string;
  types: string;
  title: string;
  description: string;
}

export interface Translated {
  category: {
    [key in Locale]: string;
  };
  types: {
    [key in Locale]: string;
  };
  title: {
    [key in Locale]: string;
  };
  description: {
    [key in Locale]: string;
  };
  tags: {
    [key in Locale]: string;
  };
  content: {
    [key in Locale]: string;
  };
}

export interface Delivery {
  country: Country;
  deliveryCharge: number;
  minOrder: number;
}

export interface Country {
  name: string;
  code: string;
  dial_code: string;
  continent?: string;
  currency: string;
  native: string;
}

export interface Visits {
  date: Date;
  user: string;
  id?: string;
}
export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  items: string[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  userId: string;
  itemId: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  orderId: string;
  method: PaymentMethod;
}

export interface Shipping {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  orderId: string;
}

export interface Notification {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Address {
  id?: string;
  phone?: string;
  fullName?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  countryData?: Country;
  userId?: string;
  dial_code?: string;
}

// define payment method
export type PaymentMethod = {
  id: PaymentId;
  name: string;
  description?: string;
  image: string;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "failed"
  | "refunded"
  | "shipped"
  | "delivered"
  | "returned"
  | "lost"
  | "stolen"
  | "damaged"
  | "shipping"
  | "awaitingPayment"
  | "awaitingFulfillment"
  | "awaitingShipment"
  | "awaitingPickup"
  | "partiallyShipped"
  | "partiallyDelivered"
  | "partiallyReturned"
  | "partiallyRefunded"
  | "disputed";

//  payement id  type
export type PaymentId =
  | "mobile"
  | "kkPay"
  | "atPickup"
  | "AfterShipping"
  | "card"
  | "crypto"
  | "paypal"
  | "stripe"
  | "flutterwave"
  | "paystack"
  | "razorpay"
  | "paytm"
  | "phonepe"
  | "upi"
  | "gpay"
  | "applepay"
  | "amazonpay"
  | "venmo"
  | "cashapp"
  | "zelle"
  | "westernunion"
  | "moneygram"
  | "paypalme"
  | "skrill"
  | "neteller"
  | "payoneer"
  | "transferwise"
  | "revolut"
  | "monzo"
  | "n26"
  | "chime"
  | "simple"
  | "varo"
  | "sofi"
  | "ally"
  | "capitalone"
  | "usbank"
  | "wellsfargo"
  | "chase"
  | "bofa"
  | "citi"
  | "amex"
  | "discover"
  | "barclays"
  | "hsbc"
  | "lloyds"
  | "santander"
  | "rbs"
  | "natwest"
  | "tsb"
  | "halifax"
  | "starling"
  | "monese"
  | "monzo"
  | "n26"
  | "revolut"
  | "transferwise"
  | "paypal"
  | "skrill"
  | "neteller"
  | "payoneer"
  | "paytm"
  | "phonepe"
  | "upi"
  | "gpay"
  | "applepay"
  | "amazonpay"
  | "venmo"
  | "cashapp"
  | "zelle"
  | "westernunion"
  | "moneygram"
  | "paypalme"
  | "skrill"
  | "neteller"
  | "payoneer"
  | "transferwise"
  | "revolut"
  | "monzo"
  | "n26"
  | "chime"
  | "simple"
  | "varo"
  | "sofi"
  | "ally"
  | "capitalone"
  | "usbank"
  | "wellsfargo"
  | "chase"
  | "bofa"
  | "citi"
  | "amex"
  | "discover"
  | "barclays"
  | "hsbc"
  | "lloyds"
  | "santander"
  | "rbs"
  | "natwest"
  | "tsb"
  | "halifax"
  | "starling"
  | "monese"
  | "monzo";

export interface ExchangeRate {
  [key: string]: number;
}

export interface Currency {
  name: string;
  symbol: string;
  rate?: number;
  chain?: string;
  fullName?: string;
  symbolUtf8?: string;
  minAmount: number;
}

export type Sizes = Alpha | Numeric | Age | Dimension;

export type SizeType = "Alpha" | "Numeric" | "Age" | "Dimension" | "ShoeSize";

export type Alpha = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";

export type Age =
  | "0-3M"
  | "3-6M"
  | "6-9M"
  | "9-12M"
  | "12-18M"
  | "18-24M"
  | "2-3Y"
  | "3-4Y"
  | "4-5Y"
  | "5-6Y"
  | "6-7Y"
  | "7-8Y"
  | "8-9Y"
  | "9-10Y"
  | "10-11Y"
  | "11-12Y";

export type Dimension = string;

export const DimensionSizes = ["Yard", "Meter"];

export type Numeric =
  | "35"
  | "36"
  | "37"
  | "38"
  | "39"
  | "40"
  | "41"
  | "42"
  | "43"
  | "44"
  | "45"
  | "46"
  | "47"
  | "48"
  | "49"
  | "50";

export type ShoeSizeType = "EU" | "US" | "UK" | "CM";
