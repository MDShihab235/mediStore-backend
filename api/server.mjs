var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports, module) {
    module.exports = {
      name: "dotenv",
      version: "16.6.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module) {
    "use strict";
    var fs = __require("fs");
    var path2 = __require("path");
    var os = __require("os");
    var crypto = __require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _log(message) {
      console.log(`[dotenv@${version}] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (debug || !quiet) {
        _log("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (debug || !quiet) {
        const keysCount = Object.keys(parsedAll).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path2.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`Failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injecting env (${keysCount}) from ${shortPaths.join(",")}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/dotenv/lib/env-options.js"(exports, module) {
    "use strict";
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_QUIET != null) {
      options.quiet = process.env.DOTENV_CONFIG_QUIET;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module.exports = options;
  }
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/dotenv/lib/cli-options.js"(exports, module) {
    "use strict";
    var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
    module.exports = function optionMatcher(args) {
      const options = args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
      if (!("quiet" in options)) {
        options.quiet = "true";
      }
      return options;
    };
  }
});

// node_modules/dotenv/config.js
var init_config = __esm({
  "node_modules/dotenv/config.js"() {
    "use strict";
    (function() {
      require_main().config(
        Object.assign(
          {},
          require_env_options(),
          require_cli_options()(process.argv)
        )
      );
    })();
  }
});

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}
var config;
var init_class = __esm({
  "generated/prisma/internal/class.ts"() {
    "use strict";
    config = {
      "previewFeatures": [],
      "clientVersion": "7.3.0",
      "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
      "activeProvider": "postgresql",
      "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Medicine {\n  id           String   @id @default(uuid())\n  name         String\n  manufacturer String\n  description  String\n  price        Decimal  @db.Decimal(10, 2)\n  stock        Int      @default(0)\n  imageUrl     String?\n  expiryDate   DateTime\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  // Relations\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: id)\n\n  authorId String\n\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  @@index([authorId])\n  @@map("medicines")\n}\n\nmodel Category {\n  id          String     @id @default(uuid())\n  name        String     @unique\n  description String?\n  medicines   Medicine[]\n\n  @@map("categories")\n}\n\nmodel Order {\n  id          String      @id @default(uuid())\n  userId      String\n  user        User        @relation(fields: [userId], references: id)\n  status      OrderStatus @default(PENDING)\n  totalAmount Decimal     @db.Decimal(10, 2)\n  createdAt   DateTime    @default(now())\n  updatedAt   DateTime    @updatedAt\n\n  items OrderItem[]\n\n  @@index([userId])\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id         String  @id @default(uuid())\n  orderId    String\n  medicineId String\n  quantity   Int\n  price      Decimal @db.Decimal(10, 2)\n\n  order    Order    @relation(fields: [orderId], references: id, onDelete: Cascade)\n  medicine Medicine @relation(fields: [medicineId], references: id)\n\n  @@index([orderId])\n  @@index([medicineId])\n  @@map("order_items")\n}\n\nenum OrderStatus {\n  PENDING\n  PAID\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel Review {\n  id         String   @id @default(uuid())\n  rating     Int // 1\u20135\n  comment    String?\n  userId     String\n  medicineId String\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  user     User     @relation(fields: [userId], references: id, onDelete: Cascade)\n  medicine Medicine @relation(fields: [medicineId], references: id, onDelete: Cascade)\n\n  // one review per user per medicine\n  @@unique([userId, medicineId])\n  @@index([medicineId])\n  @@map("reviews")\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  reviews       Review[]\n  orders        Order[]\n\n  role   String? @default("CUSTOMER")\n  phone  String?\n  status String? @default("ACTIVE")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
      "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
      }
    };
    config.runtimeDataModel = JSON.parse('{"models":{"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"}],"dbName":"medicines"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":"categories"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"}],"dbName":"order_items"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"}],"dbName":"reviews"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
    config.compilerWasm = {
      getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
      getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
      },
      importName: "./query_compiler_fast_bg.js"
    };
  }
});

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
var PrismaClientKnownRequestError2, PrismaClientUnknownRequestError2, PrismaClientRustPanicError2, PrismaClientInitializationError2, PrismaClientValidationError2, sql, empty2, join2, raw2, Sql2, Decimal2, getExtensionContext, prismaVersion, NullTypes2, DbNull2, JsonNull2, AnyNull2, ModelName, TransactionIsolationLevel, MedicineScalarFieldEnum, CategoryScalarFieldEnum, OrderScalarFieldEnum, OrderItemScalarFieldEnum, ReviewScalarFieldEnum, UserScalarFieldEnum, SessionScalarFieldEnum, AccountScalarFieldEnum, VerificationScalarFieldEnum, SortOrder, QueryMode, NullsOrder, defineExtension;
var init_prismaNamespace = __esm({
  "generated/prisma/internal/prismaNamespace.ts"() {
    "use strict";
    PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
    PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
    PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
    PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
    PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
    sql = runtime2.sqltag;
    empty2 = runtime2.empty;
    join2 = runtime2.join;
    raw2 = runtime2.raw;
    Sql2 = runtime2.Sql;
    Decimal2 = runtime2.Decimal;
    getExtensionContext = runtime2.Extensions.getExtensionContext;
    prismaVersion = {
      client: "7.3.0",
      engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
    };
    NullTypes2 = {
      DbNull: runtime2.NullTypes.DbNull,
      JsonNull: runtime2.NullTypes.JsonNull,
      AnyNull: runtime2.NullTypes.AnyNull
    };
    DbNull2 = runtime2.DbNull;
    JsonNull2 = runtime2.JsonNull;
    AnyNull2 = runtime2.AnyNull;
    ModelName = {
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
    TransactionIsolationLevel = runtime2.makeStrictEnum({
      ReadUncommitted: "ReadUncommitted",
      ReadCommitted: "ReadCommitted",
      RepeatableRead: "RepeatableRead",
      Serializable: "Serializable"
    });
    MedicineScalarFieldEnum = {
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
    CategoryScalarFieldEnum = {
      id: "id",
      name: "name",
      description: "description"
    };
    OrderScalarFieldEnum = {
      id: "id",
      userId: "userId",
      status: "status",
      totalAmount: "totalAmount",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    OrderItemScalarFieldEnum = {
      id: "id",
      orderId: "orderId",
      medicineId: "medicineId",
      quantity: "quantity",
      price: "price"
    };
    ReviewScalarFieldEnum = {
      id: "id",
      rating: "rating",
      comment: "comment",
      userId: "userId",
      medicineId: "medicineId",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    UserScalarFieldEnum = {
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
    SessionScalarFieldEnum = {
      id: "id",
      expiresAt: "expiresAt",
      token: "token",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      ipAddress: "ipAddress",
      userAgent: "userAgent",
      userId: "userId"
    };
    AccountScalarFieldEnum = {
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
    VerificationScalarFieldEnum = {
      id: "id",
      identifier: "identifier",
      value: "value",
      expiresAt: "expiresAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    SortOrder = {
      asc: "asc",
      desc: "desc"
    };
    QueryMode = {
      default: "default",
      insensitive: "insensitive"
    };
    NullsOrder = {
      first: "first",
      last: "last"
    };
    defineExtension = runtime2.Extensions.defineExtension;
  }
});

// generated/prisma/enums.js
var init_enums = __esm({
  "generated/prisma/enums.js"() {
    "use strict";
  }
});

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";
var PrismaClient;
var init_client = __esm({
  "generated/prisma/client.ts"() {
    "use strict";
    init_class();
    init_prismaNamespace();
    init_enums();
    init_enums();
    globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
    PrismaClient = getPrismaClientClass();
  }
});

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString, adapter, prisma;
var init_prisma = __esm({
  "src/lib/prisma.ts"() {
    "use strict";
    init_config();
    init_client();
    connectionString = `${process.env.DATABASE_URL}`;
    adapter = new PrismaPg({ connectionString });
    prisma = new PrismaClient({ adapter });
  }
});

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
var transporter, auth;
var init_auth = __esm({
  "src/lib/auth.ts"() {
    "use strict";
    init_prisma();
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      // Use true for port 465, false for port 587
      auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASSWORD
      }
    });
    auth = betterAuth({
      database: prismaAdapter(prisma, {
        provider: "postgresql"
        // or "mysql", "postgresql", ...etc
      }),
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
      trustedOrigins: [process.env.APP_URL],
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
  }
});

// src/modules/medicines/medicines.service.ts
var createMedicine, updateMedicine, deleteMedicine, getAllMedicines, getMedicineById, getAllCategories, medicineService;
var init_medicines_service = __esm({
  "src/modules/medicines/medicines.service.ts"() {
    "use strict";
    init_prisma();
    createMedicine = async (data, userId) => {
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
    updateMedicine = async (medicineId, data, authorId, isAuthorized) => {
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
    deleteMedicine = async (medicineId, authorId, isAuthorized) => {
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
    getAllMedicines = async ({
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
    getMedicineById = async (medicineId) => {
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
    getAllCategories = async () => {
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
    medicineService = {
      createMedicine,
      getAllMedicines,
      getMedicineById,
      updateMedicine,
      deleteMedicine,
      getAllCategories
    };
  }
});

// src/helpers/paginationSortingHelpers.ts
var paginationSortingHelper, paginationSortingHelpers_default;
var init_paginationSortingHelpers = __esm({
  "src/helpers/paginationSortingHelpers.ts"() {
    "use strict";
    paginationSortingHelper = (options) => {
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
    paginationSortingHelpers_default = paginationSortingHelper;
  }
});

// src/middlewares/auth.ts
var auth2, auth_default;
var init_auth2 = __esm({
  "src/middlewares/auth.ts"() {
    "use strict";
    init_auth();
    auth2 = (...roles) => {
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
    auth_default = auth2;
  }
});

// src/modules/medicines/medicines.controller.ts
var createMedicine2, getAllMedicines2, getMedicineById2, updateMedicine2, deleteMedicine2, getAllCategories2, medicineController;
var init_medicines_controller = __esm({
  "src/modules/medicines/medicines.controller.ts"() {
    "use strict";
    init_medicines_service();
    init_paginationSortingHelpers();
    init_auth2();
    createMedicine2 = async (req, res, next) => {
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
    getAllMedicines2 = async (req, res, next) => {
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
    getMedicineById2 = async (req, res, next) => {
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
    updateMedicine2 = async (req, res, next) => {
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
    deleteMedicine2 = async (req, res, next) => {
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
    getAllCategories2 = async (req, res, next) => {
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
    medicineController = {
      createMedicine: createMedicine2,
      getAllMedicines: getAllMedicines2,
      getMedicineById: getMedicineById2,
      updateMedicine: updateMedicine2,
      deleteMedicine: deleteMedicine2,
      getAllCategories: getAllCategories2
    };
  }
});

// src/modules/medicines/medicines.routes.ts
import express from "express";
var router, medicineRouter;
var init_medicines_routes = __esm({
  "src/modules/medicines/medicines.routes.ts"() {
    "use strict";
    init_medicines_controller();
    init_auth2();
    router = express.Router();
    router.get("/", medicineController.getAllMedicines);
    router.get("/:medicineId", medicineController.getMedicineById);
    router.get("/categories/all", medicineController.getAllCategories);
    router.post(
      "/",
      auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
      medicineController.createMedicine
    );
    router.put(
      "/:medicineId",
      auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
      medicineController.updateMedicine
    );
    router.delete(
      "/:medicineId",
      auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
      medicineController.deleteMedicine
    );
    medicineRouter = router;
  }
});

// src/middlewares/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    date: Date()
  });
}
var init_notFound = __esm({
  "src/middlewares/notFound.ts"() {
    "use strict";
  }
});

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
var globalErrorHandler_default;
var init_globalErrorHandler = __esm({
  "src/middlewares/globalErrorHandler.ts"() {
    "use strict";
    init_client();
    globalErrorHandler_default = errorHandler;
  }
});

// src/modules/orders/orders.service.ts
var createOrder, getUsersOrder, getSingleOrderDetails, getSellerOrders, orderService;
var init_orders_service = __esm({
  "src/modules/orders/orders.service.ts"() {
    "use strict";
    init_prisma();
    createOrder = async (userId, items) => {
      if (!items || items.length === 0) {
        throw new Error("Order items are required");
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
            items: {
              create: orderItemsData
            }
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
    getUsersOrder = async (userId) => {
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
    getSingleOrderDetails = async (orderId, userId) => {
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
    getSellerOrders = async (sellerId) => {
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
    orderService = {
      createOrder,
      getUsersOrder,
      getSingleOrderDetails,
      getSellerOrders
    };
  }
});

// src/modules/orders/orders.controller.ts
var createOrder2, getUsersOrder2, getSingleOrderDetails2, getSellerOrders2, orderController;
var init_orders_controller = __esm({
  "src/modules/orders/orders.controller.ts"() {
    "use strict";
    init_orders_service();
    createOrder2 = async (req, res, next) => {
      try {
        const userId = req.user?.id;
        const { items } = req.body;
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized"
          });
        }
        const order = await orderService.createOrder(userId, items);
        res.status(201).json({
          success: true,
          message: "Order created successfully",
          data: order
        });
      } catch (err) {
        next(err);
      }
    };
    getUsersOrder2 = async (req, res, next) => {
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
    getSingleOrderDetails2 = async (req, res, next) => {
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
    getSellerOrders2 = async (req, res, next) => {
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
    orderController = {
      createOrder: createOrder2,
      getUsersOrder: getUsersOrder2,
      getSingleOrderDetails: getSingleOrderDetails2,
      getSellerOrders: getSellerOrders2
    };
  }
});

// src/modules/orders/orders.routes.ts
import { Router } from "express";
var router2, ordersRouter;
var init_orders_routes = __esm({
  "src/modules/orders/orders.routes.ts"() {
    "use strict";
    init_orders_controller();
    init_auth2();
    router2 = Router();
    router2.post("/", orderController.createOrder);
    router2.get("/:userId", orderController.getUsersOrder);
    router2.get(
      "/order/:id",
      auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
      orderController.getSingleOrderDetails
    );
    router2.get(
      "/seller/orders",
      auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
      orderController.getSellerOrders
    );
    ordersRouter = router2;
  }
});

// src/modules/users/users.service.ts
var getAllUsers, getUser, usersService;
var init_users_service = __esm({
  "src/modules/users/users.service.ts"() {
    "use strict";
    init_prisma();
    getAllUsers = async () => {
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc"
        }
      });
      return users;
    };
    getUser = async (userId) => {
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      });
      return user;
    };
    usersService = {
      getAllUsers,
      getUser
    };
  }
});

// src/modules/users/users.controller.ts
var getAllUsers2, getUser2, usersController;
var init_users_controller = __esm({
  "src/modules/users/users.controller.ts"() {
    "use strict";
    init_users_service();
    getAllUsers2 = async (req, res, next) => {
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
    getUser2 = async (req, res, next) => {
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
    usersController = {
      getAllUsers: getAllUsers2,
      getUser: getUser2
    };
  }
});

// src/modules/users/users.routes.ts
import { Router as Router2 } from "express";
var router3, usersRouter;
var init_users_routes = __esm({
  "src/modules/users/users.routes.ts"() {
    "use strict";
    init_users_controller();
    init_auth2();
    router3 = Router2();
    router3.get("/", auth_default("ADMIN" /* ADMIN */), usersController.getAllUsers);
    router3.get("/:id", auth_default("ADMIN" /* ADMIN */), usersController.getUser);
    usersRouter = router3;
  }
});

// src/app.ts
import express2 from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
var app, app_default;
var init_app = __esm({
  "src/app.ts"() {
    "use strict";
    init_auth();
    init_medicines_routes();
    init_notFound();
    init_globalErrorHandler();
    init_orders_routes();
    init_users_routes();
    app = express2();
    app.use(
      cors({
        origin: process.env.APP_URL || "http://localhost:3000",
        credentials: true
      })
    );
    app.all("/api/auth/*splat", toNodeHandler(auth));
    app.use(express2.json());
    app.use("/api/medicines", medicineRouter);
    app.use("/api/orders", ordersRouter);
    app.use("/api/users", usersRouter);
    app.get("/", (req, res) => {
      res.send("This is Medi Store backend");
    });
    app.use(notFound);
    app.use(globalErrorHandler_default);
    app_default = app;
  }
});

// src/server.ts
var require_server = __commonJS({
  "src/server.ts"() {
    init_app();
    init_prisma();
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
  }
});
export default require_server();
