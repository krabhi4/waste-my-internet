import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCClientError } from "@trpc/client";
import { compareSync } from "bcryptjs";

export const adminRouter = createTRPCRouter({
  verify: publicProcedure
    .input(
      z.object({
        otp: z.string().min(6).max(6),
      }),
    )
    .query(async ({ input }) => {
      if (!input.otp) {
        throw new TRPCClientError("OTP is required");
      }
      if (input.otp.length !== 6) {
        throw new TRPCClientError("Invalid OTP Length");
      }
      if (
        compareSync(
          input.otp,
          "$2y$12$TE6v8eUK55E/OFLIjYwiFOBB3vc4iMAzfj00iH.vmDaq.qAJbWro2",
        )
      ) {
        return true;
      }
      return false;
    }),
});
