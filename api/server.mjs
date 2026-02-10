var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express2 from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Medicine {\n  id           String   @id @default(uuid())\n  name         String\n  manufacturer String\n  description  String\n  price        Decimal  @db.Decimal(10, 2)\n  stock        Int      @default(0)\n  imageUrl     String?\n  expiryDate   DateTime\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  // Relations\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: id)\n\n  authorId String\n\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  @@index([authorId])\n  @@map("medicines")\n}\n\nmodel Category {\n  id          String     @id @default(uuid())\n  name        String     @unique\n  description String?\n  medicines   Medicine[]\n\n  @@map("categories")\n}\n\nmodel Order {\n  id              String      @id @default(uuid())\n  userId          String\n  user            User        @relation(fields: [userId], references: id)\n  status          OrderStatus @default(PENDING)\n  paymentType     PaymentType\n  shippingAddress String\n  totalAmount     Decimal     @db.Decimal(10, 2)\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n\n  items OrderItem[]\n\n  @@index([userId])\n  @@map("orders")\n}\n\nenum PaymentType {\n  CASH_ON_DELIVERY\n}\n\nmodel OrderItem {\n  id         String  @id @default(uuid())\n  orderId    String\n  medicineId String\n  quantity   Int\n  price      Decimal @db.Decimal(10, 2)\n\n  order    Order    @relation(fields: [orderId], references: id, onDelete: Cascade)\n  medicine Medicine @relation(fields: [medicineId], references: id)\n\n  @@index([orderId])\n  @@index([medicineId])\n  @@map("order_items")\n}\n\nenum OrderStatus {\n  PENDING\n  PAID\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel Review {\n  id         String   @id @default(uuid())\n  rating     Int // 1\u20135\n  comment    String?\n  userId     String\n  medicineId String\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  user     User     @relation(fields: [userId], references: id, onDelete: Cascade)\n  medicine Medicine @relation(fields: [medicineId], references: id, onDelete: Cascade)\n\n  // one review per user per medicine\n  @@unique([userId, medicineId])\n  @@index([medicineId])\n  @@map("reviews")\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  reviews       Review[]\n  orders        Order[]\n\n  role   String? @default("CUSTOMER")\n  phone  String?\n  status String? @default("ACTIVE")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"}],"dbName":"medicines"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":"categories"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentType","kind":"enum","type":"PaymentType"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"}],"dbName":"order_items"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"}],"dbName":"reviews"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MedicineScalarFieldEnum: () => MedicineScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Medicine: "Medicine",
  Category: "Category",
  Order: "Order",
  OrderItem: "OrderItem",
  Review: "Review",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var MedicineScalarFieldEnum = {
  id: "id",
  name: "name",
  manufacturer: "manufacturer",
  description: "description",
  price: "price",
  stock: "stock",
  imageUrl: "imageUrl",
  expiryDate: "expiryDate",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  categoryId: "categoryId",
  authorId: "authorId"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description"
};
var OrderScalarFieldEnum = {
  id: "id",
  userId: "userId",
  status: "status",
  paymentType: "paymentType",
  shippingAddress: "shippingAddress",
  totalAmount: "totalAmount",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  medicineId: "medicineId",
  quantity: "quantity",
  price: "price"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  userId: "userId",
  medicineId: "medicineId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD
  }
});
var auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [
    "http://localhost:3000",
    "https://medi-store-frontend-chi.vercel.app"
  ],
  basePath: "/api/auth",
  cookies: {
    secure: true,
    sameSite: "none",
    httpOnly: true
  },
  // trustedOrigins: ["https://medi-store-frontend-chi.vercel.app"],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  // trustedOrigins: [
  //   process.env.APP_URL!,
  //   "https://medi-store-frontend-chi.vercel.app",
  //   "http://localhost:3000",
  // ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
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
                                    If the button doesn\u2019t work, copy and paste this link into your browser:
                                  </p>
                                  <p style="font-size:14px; word-break:break-all; color:#4f46e5;">
                                    ${url}
                                  </p>

                                  <p style="font-size:14px; color:#555555; margin-top:30px;">
                                    If you didn\u2019t create an account, you can safely ignore this email.
                                  </p>

                                  <p style="font-size:14px; color:#555555;">
                                    \u2014 The Prisma Blog Team
                                  </p>
                                </td>
                              </tr>

                              <!-- Footer -->
                              <tr>
                                <td style="background-color:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#888888;">
                                  \xA9 2026 Medi Store. All rights reserved.
                                </td>
                              </tr>

                            </table>
                          </td>
                        </tr>
                      </table>
                    </body>
                    </html>
                    `
        });
        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/modules/medicines/medicines.routes.ts
import express from "express";

// src/modules/medicines/medicines.service.ts
var createMedicine = async (data, userId) => {
  const result = await prisma.medicine.create({
    data: {
      ...data,
      expiryDate: new Date(data.expiryDate),
      authorId: userId,
      category: {
        connectOrCreate: {
          where: { name: data.category },
          create: { name: data.category }
        }
      }
    }
  });
  return result;
};
var updateMedicine = async (medicineId, data, authorId, isAuthorized) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId
    },
    select: {
      id: true,
      authorId: true
    }
  });
  if (!isAuthorized && medicineData.authorId !== authorId) {
    throw new Error("You are not the owner/creator of the post!");
  }
  const result = await prisma.medicine.update({
    where: {
      id: medicineData.id
    },
    data
  });
  return result;
};
var deleteMedicine = async (medicineId, authorId, isAuthorized) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId
    },
    select: {
      id: true,
      authorId: true
    }
  });
  if (!isAuthorized && medicineData.authorId !== authorId) {
    throw new Error("You are not the owner/creator of the post!");
  }
  return await prisma.medicine.delete({
    where: {
      id: medicineId
    }
  });
};
var getAllMedicines = async ({
  search,
  category,
  minPrice,
  maxPrice,
  manufacturer,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          category: {
            is: {
              name: {
                contains: search,
                mode: "insensitive"
              }
            }
          }
        }
      ]
    });
  }
  if (category) {
    andConditions.push({
      category: {
        is: {
          name: {
            equals: category,
            mode: "insensitive"
          }
        }
      }
    });
  }
  if (manufacturer) {
    andConditions.push({
      manufacturer: {
        equals: manufacturer,
        mode: "insensitive"
      }
    });
  }
  if (minPrice !== void 0 || maxPrice !== void 0) {
    const priceFilter = {};
    if (minPrice !== void 0) priceFilter.gte = minPrice;
    if (maxPrice !== void 0) priceFilter.lte = maxPrice;
    andConditions.push({
      price: priceFilter
    });
  }
  if (authorId) {
    andConditions.push({ authorId });
  }
  const whereCondition = andConditions.length ? { AND: andConditions } : {};
  const data = await prisma.medicine.findMany({
    take: limit,
    skip,
    where: whereCondition,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      category: true,
      _count: {
        select: {
          orderItems: true,
          reviews: true
        }
      }
    }
  });
  const total = await prisma.medicine.count({
    where: whereCondition
  });
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit)
    }
  };
};
var getMedicineById = async (medicineId) => {
  const medicine = await prisma.medicine.findUnique({
    where: {
      id: medicineId
    },
    include: {
      category: true,
      orderItems: true,
      reviews: {
        orderBy: {
          createdAt: "desc"
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      },
      _count: {
        select: {
          reviews: true,
          orderItems: true
        }
      }
    }
  });
  if (!medicine) {
    throw new Error("Medicine not found");
  }
  return medicine;
};
var getAllCategories = async () => {
  const result = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          medicines: true
        }
      }
    }
  });
  return result;
};
var medicineService = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getAllCategories
};

// src/helpers/paginationSortingHelpers.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelpers_default = paginationSortingHelper;

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized"
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required. Please verify your email!"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permisssion to access this resources"
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
var auth_default = auth2;

// src/modules/medicines/medicines.controller.ts
var createMedicine2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const result = await medicineService.createMedicine(
      req.body,
      user.id
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
var getMedicineById2 = async (req, res, next) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId || typeof medicineId !== "string") {
      throw new Error("Medicine Id is required!!!");
    }
    const result = await medicineService.getMedicineById(medicineId);
    res.status(200).json({
      success: true,
      result
    });
  } catch (err) {
    next(err);
  }
};
var updateMedicine2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const { medicineId } = req.params;
    const isAuthorized = user.role === "ADMIN" /* ADMIN */ || user.role === "SELLER" /* SELLER */;
    const result = await medicineService.updateMedicine(
      medicineId,
      req.body,
      user.id,
      isAuthorized
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
var deleteMedicine2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const { medicineId } = req.params;
    const isAuthorized = user.role === "ADMIN" /* ADMIN */ || user.role === "SELLER" /* SELLER */;
    const result = await medicineService.deleteMedicine(
      medicineId,
      user.id,
      isAuthorized
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
var getAllMedicines2 = async (req, res, next) => {
  try {
    const { search, category, manufacturer, minPrice, maxPrice } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const categoryString = typeof category === "string" ? category : void 0;
    const manufacturerString = typeof manufacturer === "string" ? manufacturer : void 0;
    const minPriceNumber = typeof minPrice === "string" ? Number(minPrice) : void 0;
    const maxPriceNumber = typeof maxPrice === "string" ? Number(maxPrice) : void 0;
    const authorId = typeof req.query.authorId === "string" ? req.query.authorId : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelpers_default(
      req.query
    );
    const result = await medicineService.getAllMedicines({
      search: searchString,
      category: categoryString,
      manufacturer: manufacturerString,
      minPrice: minPriceNumber,
      maxPrice: maxPriceNumber,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};
var getAllCategories2 = async (req, res, next) => {
  try {
    const categories = await medicineService.getAllCategories();
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
var medicineController = {
  createMedicine: createMedicine2,
  getAllMedicines: getAllMedicines2,
  getMedicineById: getMedicineById2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2,
  getAllCategories: getAllCategories2
};

// src/modules/medicines/medicines.routes.ts
var router = express.Router();
router.get("/", medicineController.getAllMedicines);
router.get("/:medicineId", medicineController.getMedicineById);
router.get("/categories/all", medicineController.getAllCategories);
router.post(
  "/",
  auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  medicineController.createMedicine
);
router.put("/:medicineId", medicineController.updateMedicine);
router.delete(
  "/:medicineId",
  auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  medicineController.deleteMedicine
);
var medicineRouter = router;

// src/middlewares/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    date: Date()
  });
}

// src/middlewares/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields!";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "An operation failed because it depends on one or more records that were required but not found.!";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Duplicate key error";
    } else if (err.code === "2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed!";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occured during query execution!";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed. please check your credentials!";
    } else if (err.errorCode === "P1001") {
      statusCode = 400;
      errorMessage = "Can't reach database server!";
    }
  }
  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails
  });
}
var globalErrorHandler_default = errorHandler;

// src/modules/orders/orders.routes.ts
import { Router } from "express";

// src/modules/orders/orders.service.ts
var createOrder = async (userId, items, shippingAddress) => {
  if (!items || items.length === 0) {
    throw new Error("Order items are required");
  }
  if (!shippingAddress) {
    throw new Error("Shipping address is required");
  }
  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const medicineIds = items.map((i) => i.medicineId);
    const medicines = await tx.medicine.findMany({
      where: { id: { in: medicineIds } }
    });
    if (medicines.length !== items.length) {
      throw new Error("One or more medicines not found");
    }
    const orderItemsData = items.map((item) => {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      if (medicine.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${medicine.name}`);
      }
      const itemTotal = Number(medicine.price) * item.quantity;
      totalAmount += itemTotal;
      return {
        medicineId: medicine.id,
        quantity: item.quantity,
        price: medicine.price
      };
    });
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        paymentType: "CASH_ON_DELIVERY",
        shippingAddress,
        items: { create: orderItemsData }
      },
      include: {
        items: true
      }
    });
    for (const item of items) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: { decrement: item.quantity }
        }
      });
    }
    return order;
  });
};
var getUsersOrder = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const orders = await prisma.order.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              manufacturer: true
            }
          }
        }
      }
    }
  });
  return orders;
};
var getSingleOrderDetails = async (orderId, userId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId
      // VERY IMPORTANT: user can only see their own order
    },
    include: {
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              manufacturer: true,
              price: true,
              imageUrl: true,
              expiryDate: true
            }
          }
        }
      }
    }
  });
  if (!order) {
    throw new Error("Order not found or access denied");
  }
  return order;
};
var getSellerOrders = async (sellerId) => {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: {
            authorId: sellerId
            // seller owns the medicine
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      items: {
        where: {
          medicine: {
            authorId: sellerId
            // ONLY seller's items
          }
        },
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });
  return orders;
};
var getMedicineStock = async (medicineId) => {
  const stock = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { stock: true }
  });
  return stock;
};
var validateCartStock = async (items) => {
  if (!items || items.length === 0) {
    throw new Error("Cart items are required");
  }
  const medicineIds = items.map((i) => i.medicineId);
  const medicines = await prisma.medicine.findMany({
    where: { id: { in: medicineIds } },
    select: {
      id: true,
      name: true,
      stock: true
    }
  });
  const errors = [];
  for (const item of items) {
    const medicine = medicines.find((m) => m.id === item.medicineId);
    if (!medicine) {
      errors.push({
        medicineId: item.medicineId,
        message: "Medicine not found"
      });
      continue;
    }
    if (medicine.stock === 0) {
      errors.push({
        medicineId: medicine.id,
        message: "Stock not available",
        availableStock: 0
      });
      continue;
    }
    if (item.quantity > medicine.stock) {
      errors.push({
        medicineId: medicine.id,
        message: "Insufficient stock",
        availableStock: medicine.stock
      });
    }
  }
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return { valid: true };
};
var cancelOrder = async (orderId, userId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        userId
        // 🔐 ownership check
      },
      include: {
        items: true
      }
    });
    if (!order) {
      throw new Error("Order not found or access denied");
    }
    if (order.status !== "PENDING") {
      throw new Error("Only pending orders can be cancelled");
    }
    for (const item of order.items) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      });
    }
    const cancelledOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED"
      }
    });
    return cancelledOrder;
  });
};
var orderService = {
  createOrder,
  getUsersOrder,
  getSingleOrderDetails,
  getSellerOrders,
  getMedicineStock,
  validateCartStock,
  cancelOrder
};

// src/modules/orders/orders.controller.ts
var createOrder2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { items, shippingAddress } = req.body;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const order = await orderService.createOrder(
      userId,
      items,
      shippingAddress
    );
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });
  } catch (err) {
    next(err);
  }
};
var getUsersOrder2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const orders = await orderService.getUsersOrder(userId);
    res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      data: orders
    });
  } catch (err) {
    next(err);
  }
};
var getSingleOrderDetails2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id: orderId } = req.params;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const order = await orderService.getSingleOrderDetails(
      orderId,
      userId
    );
    res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order
    });
  } catch (err) {
    next(err);
  }
};
var getSellerOrders2 = async (req, res, next) => {
  try {
    const sellerId = req.user?.id;
    const role = req.user?.role;
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    if (role !== "SELLER") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller only."
      });
    }
    const orders = await orderService.getSellerOrders(sellerId);
    res.status(200).json({
      success: true,
      message: "Seller orders fetched successfully",
      data: orders
    });
  } catch (err) {
    next(err);
  }
};
var getMedicineStock2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicine = await orderService.getMedicineStock(id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.json({ stock: medicine.stock });
  } catch (err) {
    next(err);
  }
};
var validateCart = async (req, res, next) => {
  try {
    const { items } = req.body;
    const result = await orderService.validateCartStock(items);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
var cancelOrder2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id: orderId } = req.params;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const order = await orderService.cancelOrder(orderId, userId);
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (err) {
    next(err);
  }
};
var orderController = {
  createOrder: createOrder2,
  getUsersOrder: getUsersOrder2,
  getSingleOrderDetails: getSingleOrderDetails2,
  getSellerOrders: getSellerOrders2,
  getMedicineStock: getMedicineStock2,
  validateCart,
  cancelOrder: cancelOrder2
};

// src/modules/orders/orders.routes.ts
var router2 = Router();
router2.post(
  "/",
  auth_default("CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  orderController.createOrder
);
router2.get(
  "/:userId",
  auth_default("CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  orderController.getUsersOrder
);
router2.get(
  "/order/:id",
  auth_default("CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  orderController.getSingleOrderDetails
);
router2.get(
  "/seller/orders",
  auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  orderController.getSellerOrders
);
router2.get("/:medicineId/stock", orderController.getMedicineStock);
router2.post("/cart/validate", orderController.validateCart);
router2.patch("/order/:id/cancel", orderController.cancelOrder);
var ordersRouter = router2;

// src/modules/users/users.routes.ts
import { Router as Router2 } from "express";

// src/modules/users/users.service.ts
var getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return users;
};
var getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  return user;
};
var updateUserStatus = async (userId, status) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status }
  });
};
var updateUserRole = async (userId, role) => {
  return prisma.user.update({
    where: { id: userId },
    data: { role }
  });
};
var usersService = {
  getAllUsers,
  getUser,
  updateUserStatus,
  updateUserRole
};

// src/modules/users/users.controller.ts
var getAllUsers2 = async (req, res, next) => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (err) {
    next(err);
  }
};
var getUser2 = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const user = await usersService.getUser(userId);
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user
    });
  } catch (err) {
    next(err);
  }
};
var banOrUnbanUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    const user = await usersService.updateUserStatus(userId, status);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};
var changeUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await usersService.updateUserRole(userId, role);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};
var usersController = {
  getAllUsers: getAllUsers2,
  getUser: getUser2,
  banOrUnbanUser,
  changeUserRole
};

// src/modules/users/users.routes.ts
var router3 = Router2();
router3.get("/", usersController.getAllUsers);
router3.get("/:id", usersController.getUser);
router3.patch("/:userId/status", usersController.banOrUnbanUser);
router3.patch("/:userId/role", usersController.changeUserRole);
var usersRouter = router3;

// src/app.ts
var app = express2();
app.set("trust proxy", 1);
var allowedOrigins = [
  "http://localhost:3000",
  "https://medi-store-frontend-chi.vercel.app"
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  })
);
app.use(express2.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/medicines", medicineRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.get("/", (req, res) => {
  res.send("This is Medi Store backend");
});
app.use(notFound);
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
var port = process.env.PORT;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully");
    app_default.listen(port, () => {
      console.log(`Server is running on http:localhost:${port}`);
    });
  } catch (error) {
    console.error("An error occured:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
var server_default = app_default;
export {
  server_default as default
};
