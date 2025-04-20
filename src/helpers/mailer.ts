// @ts-ignore
import nodemailer from "nodemailer";
import User from "../models/userModel";
// @ts-ignore
import bcryptjs from "bcryptjs";

interface SendEmailProps {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailProps): Promise<any> => {
  try {
    // create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Update the appropriate token based on emailType
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    // Define email content based on the type
    const subject =
      emailType === "VERIFY"
        ? "Welcome to Rahman's Kanban Board, please verify your email"
        : "Reset your password";

    const mainMessage =
      emailType === "VERIFY"
        ? "To complete your registration, please click on the button below to verify your email address:"
        : "To reset your password, please click on the button below:";

    const buttonLabel =
      emailType === "VERIFY" ? "Verify Email Address" : "Reset Password";

    const alternativeMessage =
      emailType === "VERIFY"
        ? "Alternatively, you can copy and paste the following link into your browser to verify your email:"
        : "Alternatively, you can copy and paste the following link into your browser to reset your password:";

    const mailOptions = {
      from: "@rufaiabdulrahman21@gmail.com",
      to: email,
      subject: subject,
      html: `<div style="background-color: #fafafa; padding: 20px; border-radius: 10px;">
                <h1 style="color: #192586; margin-bottom: 20px;">${
                  emailType === "VERIFY"
                    ? "Welcome to Rahman's Kanban board!"
                    : "Reset Your Password"
                }</h1>
                <p style="color: #737373; margin-bottom: 15px;">Greetings!</p>
                <p style="color: #737373; margin-bottom: 15px;">${mainMessage}</p>
                <p style="text-align: center; margin-bottom: 20px;">
                    <a href="https://kanban-board-vert-seven.vercel.app/${
        emailType === "VERIFY" ? "verifyEmail" : "resetpassword"
      }?token=${hashedToken}" style="background-color: #192586; color: #fafafa; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
                        ${buttonLabel}
                    </a>
                </p>
                <p style="color: #737373; margin-bottom: 15px;">${alternativeMessage}</p>
                <p style="color: #737373; margin-bottom: 15px;">
                    https://kanban-board-vert-seven.vercel.app/${
        emailType === "VERIFY" ? "verifyEmail" : "resetpassword"
      }?token=${hashedToken}
                </p>
            </div>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
