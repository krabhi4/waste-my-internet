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
  getAll: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.dataWaster.findMany();
    const totalDataWasted = data.reduce(
      (acc, curr) => acc + (curr.totalWasted ?? 0),
      0,
    );
    const totalUsers = data.reduce(
      (acc, curr) => acc + (curr.userId ? 1 : 0),
      0,
    );
    return { data, totalDataWasted, totalUsers };
  }),
  delete: publicProcedure
    .input(z.string().array())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.dataWaster.deleteMany({
        where: { id: { in: input } },
      });
    }),
});
