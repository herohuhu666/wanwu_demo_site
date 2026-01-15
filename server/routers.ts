import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { callQwen } from "./_core/qwen";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Qwen chat router for Lingxi (Insight) feature
  qwen: router({
    chat: publicProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["system", "user", "assistant"]),
              content: z.string(),
            })
          ),
          temperature: z.number().min(0).max(2).optional(),
          max_tokens: z.number().min(1).max(4000).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const response = await callQwen({
            messages: input.messages,
            temperature: input.temperature,
            max_tokens: input.max_tokens,
          });

          return {
            success: true,
            message: response.choices[0]?.message.content || "",
            usage: response.usage,
          };
        } catch (error) {
          console.error("[Qwen Chat Error]", error);
          return {
            success: false,
            message: "抱歉，灵犀暂时无法回应。请稍后再试。",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
