import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  trustedOrigins: [
    process.env.APP_URL!,
    "https://medi-store-frontend-chi.vercel.app",
    "https://medi-store-backend-delta.vercel.app",
    "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Medi Store" <medistore@md.com>',
          to: user.email,
          subject: "Please verify your email",
          html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                      <title>Email Verification</title>
                    </head>
                    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
                        <tr>
                          <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
                              
                              <!-- Header -->
                              <tr>
                                <td style="background-color:#4f46e5; padding:20px; text-align:center;">
                                  <h1 style="color:#ffffff; margin:0;">Medi Store</h1>
                                </td>
                              </tr>

                              <!-- Body -->
                              <tr>
                                <td style="padding:30px; color:#333333;">
                                  <h2 style="margin-top:0;">Verify your email address</h2>
                                  <p style="font-size:16px; line-height:1.6;">
                                    Thanks ${user.name} for signing up for <strong>Medi Store</strong>!  
                                    Please confirm your email address by clicking the button below.
                                  </p>

                                  <div style="text-align:center; margin:30px 0;">
                                    <a href="${verificationUrl}"
                                      style="background-color:#4f46e5; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-size:16px; display:inline-block;">
                                      Verify Email
                                    </a>
                                  </div>

                                  <p style="font-size:14px; color:#555555; line-height:1.6;">
                                    If the button doesn’t work, copy and paste this link into your browser:
                                  </p>
                                  <p style="font-size:14px; word-break:break-all; color:#4f46e5;">
                                    ${url}
                                  </p>

                                  <p style="font-size:14px; color:#555555; margin-top:30px;">
                                    If you didn’t create an account, you can safely ignore this email.
                                  </p>

                                  <p style="font-size:14px; color:#555555;">
                                    — The Prisma Blog Team
                                  </p>
                                </td>
                              </tr>

                              <!-- Footer -->
                              <tr>
                                <td style="background-color:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#888888;">
                                  © 2026 Medi Store. All rights reserved.
                                </td>
                              </tr>

                            </table>
                          </td>
                        </tr>
                      </table>
                    </body>
                    </html>
                    `,
        });

        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
