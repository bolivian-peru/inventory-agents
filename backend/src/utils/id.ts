import { nanoid } from "nanoid";
import { ID_PREFIX } from "../config/constants.js";

export function generateId(prefix: keyof typeof ID_PREFIX): string {
  return `${ID_PREFIX[prefix]}${nanoid(21)}`;
}

export function generateSellerId(): string {
  return generateId("SELLER");
}

export function generateEtsyConnectionId(): string {
  return generateId("ETSY_CONNECTION");
}

export function generateProductId(): string {
  return generateId("PRODUCT");
}

export function generateAgentId(): string {
  return generateId("AGENT");
}

export function generateInboxId(): string {
  return generateId("INBOX");
}

export function generateEventId(): string {
  return generateId("EVENT");
}

export function generateChannelId(): string {
  return generateId("CHANNEL");
}
