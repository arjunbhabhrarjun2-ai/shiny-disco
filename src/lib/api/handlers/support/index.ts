// Route table for the /api/support/* catch-all (src/app/api/support/[...path]/route.ts).
import type { ApiRouteTable } from "../../types";
import * as createTicket from "./create-ticket";
import * as closeTicket from "./closeTicket";
import * as reopenTicket from "./reopenTicket";
import * as sendMessage from "./send-message";
import * as getMessages from "./get-messages";
import * as getTickets from "./get-tickets";
import * as image from "./image";
import * as attachment from "./attachment";
import * as upload from "./upload";

export const routes: ApiRouteTable = [
  { pattern: "create-ticket", handlers: { POST: createTicket.POST } },
  { pattern: ":id/close", handlers: { PATCH: closeTicket.PATCH } },
  { pattern: ":id/reopen", handlers: { PATCH: reopenTicket.PATCH } },
  { pattern: "send-message", handlers: { POST: sendMessage.POST } },
  { pattern: "get-messages", handlers: { GET: getMessages.GET } },
  { pattern: "get-tickets", handlers: { GET: getTickets.GET } },
  { pattern: "image/:name", handlers: { GET: image.GET } },
  { pattern: "attachment/:id", handlers: { GET: attachment.GET } },
  { pattern: "upload", handlers: { POST: upload.POST } },
];
