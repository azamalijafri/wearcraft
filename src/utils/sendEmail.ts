import OrderPlacedEmail from "@/components/emails/OrderPlacedEmail";

// utils/sendEmail.ts

import nodemailer from "nodemailer";
import { renderToStaticMarkup } from "react-dom/server";

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

const transporter = nodemailer.createTransport({
  host: "gmail.com", // Replace with your SMTP host
  port: 587,
  secure: false,
  auth: {
    user: "wearcraft.app@gmail.com",
    pass: "newtons4thlaw",
  },
});

const sendOrderPlacedEmail = async (
  shippingAddress: any,
  orderId: string,
  orderDate: string,
  recipientEmail: string
) => {
  const emailHtml = renderToStaticMarkup(
    OrderPlacedEmail({ shippingAddress: shippingAddress, orderId, orderDate })
  );

  const mailOptions = {
    from: "wearcraft.app@gmail.com",
    to: recipientEmail,
    subject: "Your order summary and estimated delivery date",
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export { sendOrderPlacedEmail };
