import { setupWorker } from "msw/browser";
import { http, HttpResponse, ws } from "msw";

import { AppConfig } from "../AppConfig.ts";
import { getInitialMatches } from "./getInitialMatches.ts";
import { getRandomMatchUpdates } from "./getRandomMatchUpdates.ts";

// kind of DB
const MACTHES = getInitialMatches();

const matchUpdates = ws.link("wss://live-updates.com");

export const worker = setupWorker(
  matchUpdates.addEventListener("connection", ({ client }) => {
    const interval = setInterval(() => {
      client.send(JSON.stringify(getRandomMatchUpdates({ matches: MACTHES })));
    }, AppConfig.WS_INTERVAL);

    client.addEventListener("close", () => {
      clearInterval(interval);
    });
  }),
  http.get("/api/matches", () => {
    return HttpResponse.json(MACTHES);
  })
);
