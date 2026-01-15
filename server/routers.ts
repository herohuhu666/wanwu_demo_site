import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { callQwen, callQwenVision } from "./_core/qwen";
import { storagePut } from "./storage";
import { generateImage } from "./_core/imageGeneration";
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
    
    // Divination API for "指物断事" (Object-based Divination) feature
    divination: publicProcedure
      .input(
        z.object({
          imageData: z.string(), // Base64 encoded image data
          eventDescription: z.string(), // User's description of the event/question
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
          const fileKey = `divination/${timestamp}-${randomSuffix}.jpg`;
          
          const { url: imageUrl } = await storagePut(
            fileKey,
            buffer,
            "image/jpeg"
          );

          // Get current time for Qimen Dunjia analysis
          const now = new Date();
          const hour = now.getHours();
          const timeInfo = `当前时辰：${hour}时`;

          // Build Qimen Dunjia analysis prompt
          const analysisPrompt = `你是一位精通奇门遁甲、五行、九宫的传统文化学者。

用户上传了一张图片并描述了一个事件："${input.eventDescription}"
${timeInfo}

请根据：
1. 图片中的物象、颜色、形态、方位
2. 事件的描述
3. 当前的时辰

进行分析，并给出：

**五行属性**：该事物/事件的五行归属（木火土金水）

**九宫方位**：所处的方位吉凶（九宫体系）

**时机判断**：当下是否适宜进行此事

**建议方向**：简洁的行动建议

注意：
- 使用传统术语但保持通俗易懂
- 回答不超过250字
- 避免绝对化判断（如“必然”“注定”“大凶”）
- 保持禅意和启发性
- 最后附上：“本内容为传统文化趣味参考，不构成决策依据”`;

          // Call Qwen Vision API
          const response = await callQwenVision(
            imageUrl,
            analysisPrompt
          );

          return {
            success: true,
            imageUrl,
            analysis: response.choices[0]?.message.content || "",
            usage: response.usage,
          };
        } catch (error) {
          console.error("[Divination API Error]", error);
          return {
            success: false,
            imageUrl: "",
            analysis: "抱歉，无法完成分析。请稍后再试。",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    
    // Heart Mirror Image Generation
    generateHeartImage: publicProcedure
      .input(
        z.object({
          question: z.string(),
          state: z.enum(["steady", "advance", "retreat"]),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Build prompt based on state and question
          const stateDescriptions = {
            steady: "平静、均衡、稳定的能量，大地色调",
            advance: "向上、热烈、充满活力的能量，金色和火红色调",
            retreat: "内省、深沉、宁静的能量，深蓝和黑色调",
          };

          const prompt = `Create an abstract, minimalist art piece that represents the emotional and spiritual state of someone asking: "${input.question}". 

The artwork should embody ${stateDescriptions[input.state]}. 

Style: Eastern philosophy, Zen aesthetic, flowing organic forms, subtle gradients, contemplative mood. 
Avoid: text, symbols, faces, recognizable objects. 
Focus on: abstract shapes, color harmony, emotional resonance.`;

          const { url: imageUrl } = await generateImage({ prompt });

          return {
            success: true,
            imageUrl,
          };
        } catch (error) {
          console.error("[Heart Image Generation Error]", error);
          return {
            success: false,
            imageUrl: "",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
