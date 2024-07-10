import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.upload.createMany({
        data: input.file.map((file) => ({
          fileName: file.fileName,
          size: file.size,
          userId: input.userId,
        })),
      });
    }),
});
