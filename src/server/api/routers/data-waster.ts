import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const dataWasterRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        totalWasted: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.dataWaster.create({
        data: { ...input },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        totalWasted: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.dataWaster.update({
        where: { id: input.id },
        data: {
          totalWasted: input.totalWasted,
          userId: input.userId,
        },
      });
    }),
});