import { APIEvent } from "solid-start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/lib/router";
import dbConnect from "~/lib/mongoose";

const handler = (event: APIEvent) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: event.request,
    router: appRouter,
    createContext: async () => {
      await dbConnect();
      return {};
    },
  });

export const GET = handler;
export const POST = handler;
