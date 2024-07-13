import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import axios from "axios";
import { TRPCClientError } from "@trpc/client";
import { env } from "@/env";

export const uploadRouter = createTRPCRouter({
  upload: publicProcedure
    .input(
      z.object({
        file: z.array(
          z.object({
            fileName: z.string(),
            size: z.number(),
          }),
        ),
        userId: z.string(),
        response: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.upload.createMany({
        data: input.file.map((file) => ({
          fileName: file.fileName,
          size: file.size,
          userId: input.userId,
          response: input.response,
        })),
      });
    }),
  getIp: publicProcedure.query(async () => {
    let ip;
    try {
      const response = await axios.get(env.USER_ID_URL);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      ip = response.data.ip as string;
    } catch (error) {
      console.error("Error fetching IP:", error);
      ip = "Failed to get IP";
    }
    return ip;
  }),
  getData: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.upload.findMany({
      select: {
        id: true,
        size: true,
        fileName: true,
        userId: true,
      },
    });
  }),
  delete: publicProcedure
    .input(z.string().array())
    .mutation(async ({ ctx, input }) => {
      if (input.length === 0) {
        throw new TRPCClientError("No IDs provided to delete");
      }
      return await ctx.db.upload.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });
    }),
});
