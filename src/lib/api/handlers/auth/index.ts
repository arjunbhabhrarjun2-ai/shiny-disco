// Route table for the /api/auth/* catch-all (src/app/api/auth/[...path]/route.ts).
import type { ApiRouteTable } from "../../types";
import * as loginPassword from "./login-password";
import * as signin from "./signin";
import * as signup from "./signup";
import * as verifyCredentials from "./verifyCredentials";
import * as verifyKey from "./verify-key";
import * as verifyPrivateKey from "./verifyPrivateKey";

export const routes: ApiRouteTable = [
  { pattern: "login-password", handlers: { POST: loginPassword.POST } },
  { pattern: "signin", handlers: { POST: signin.POST } },
  { pattern: "signup", handlers: { POST: signup.POST } },
  { pattern: "verifyCredentials", handlers: { POST: verifyCredentials.POST } },
  { pattern: "verify-key", handlers: { POST: verifyKey.POST } },
  { pattern: "verifyPrivateKey", handlers: { POST: verifyPrivateKey.POST } },
];
