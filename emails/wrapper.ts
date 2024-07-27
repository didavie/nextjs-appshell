import { Locale } from "../i18n-config";
import { Dictionary } from "../get-dictionary";
import React from "react";
import { defaultColor } from "../config/colors";

export const EmailWrapper = ({
  params: { lang, dictionary, children, title },
}: {
  params: {
    lang: Locale;
    dictionary: Dictionary;
    children: React.ReactNode;
    title: string;
  };
}) => {
  return `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        ${title}
    </title>
</head>
<body style="font-family: 'Poppins', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 20px;">
                <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid ${defaultColor};">
                    ${children}
                </table>
            </td>
        </tr>
         <tr>
            <td class="footer" style="background-color: #333333; padding: 40px; text-align: center; color: white; font-size: 14px;">
                <p>
                    © ${new Date().getFullYear()}${"CompanyName"} 
            </td>
        </tr>
    </table>
</body>
</html>`;
};
