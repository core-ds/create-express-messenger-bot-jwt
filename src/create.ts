import * as core from "@actions/core";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

export function main(): string {
  const serverUrl = core.getInput("express-server-url", { required: true });
  const botId = core.getInput("bot-id", { required: true });
  const secretKey = core.getInput("secret-key", { required: true });
  const expiresInMinutes = Number(core.getInput("expires-in") || 10);
  const nowInSeconds = Math.floor(Date.now() / 1000);

  const payload = {
    iss: botId,
    aud: URL.canParse(serverUrl) ? URL.parse(serverUrl)!.host : serverUrl,
    exp: nowInSeconds + 60 * expiresInMinutes,
    nbf: nowInSeconds,
    iat: nowInSeconds,
    jti: randomUUID(),
    version: 2,
  };

  const token = jwt.sign(payload, secretKey, { algorithm: "HS256" });

  core.setSecret(token);
  core.setOutput("token", token);

  return token;
}
