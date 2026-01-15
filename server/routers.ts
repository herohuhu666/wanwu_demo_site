import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { callQwen, callQwenVision } from "./_core/qwen";
import { storagePut } from "./storage";
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
    
    // Vision API for "指物寻物" (Object Recognition) feature
    vision: publicProcedure
      .input(
        z.object({
          imageData: z.string(), // Base64 encoded image data
          customPrompt: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Convert base64 to buffer
          const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          
          // Upload to S3
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(7);
          const fileKey = `zhiwu/${timestamp}-${randomSuffix}.jpg`;
          
          const { url: imageUrl } = await storagePut(
            fileKey,
            buffer,
            "image/jpeg"
          );

          // Call Qwen Vision API
          const response = await callQwenVision(
            imageUrl,
            input.customPrompt
          );

          return {
            success: true,
            imageUrl,
            interpretation: response.choices[0]?.message.content || "",
            usage: response.usage,
          };
        } catch (error) {
          console.error("[Qwen Vision Error]", error);
          return {
            success: false,
            imageUrl: "",
            interpretation: "抱歉，无法识别此物。请稍后再试。",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
