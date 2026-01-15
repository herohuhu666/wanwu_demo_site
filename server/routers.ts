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
    
    // Vision API for "看人识人" (Person Recognition) feature
    vision: publicProcedure
      .input(
        z.object({
          imageUrl: z.string(),
          prompt: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const response = await callQwenVision(
            input.imageUrl,
            input.prompt
          );

          return {
            success: true,
            message: response.choices[0]?.message.content || "",
            usage: response.usage,
          };
        } catch (error) {
          console.error("[Qwen Vision Error]", error);
          return {
            success: false,
            message: "抱歉，无法完成分析。请稍后再试。",
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
    
    // Ritual Hexagram Explanation for members
    explainHexagram: publicProcedure
      .input(
        z.object({
          hexagramName: z.string(),
          judgment: z.string(),
          image: z.string(),
          isMember: z.boolean(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          if (!input.isMember) {
            // Non-members get the original text
            return {
              success: true,
              explanation: input.judgment,
              isMember: false,
            };
          }

          // Members get AI-generated easy-to-understand explanation
          const prompt = `你是一位精通周易的传统文化学者。用户得到了卦象"${input.hexagramName}"。

原文：
卦辞：${input.judgment}
象曰：${input.image}

请用通俗易懂的现代语言，用2-3句话解释这个卦象对当下生活的启示。避免使用晦涩的古文术语，要让普通人也能理解。

解释要点：
1. 这个卦象代表什么状态或趋势
2. 对当下生活的实际意义
3. 建议的行动方向（如果有的话）

回答不超过100字，保持禅意和启发性。`;

          const response = await callQwen({
            messages: [
              {
                role: "system",
                content: "你是一位精通周易的传统文化学者，用通俗易懂的语言解释卦象。",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 150,
          });

          return {
            success: true,
            explanation: response.choices[0]?.message.content || input.judgment,
            isMember: true,
          };
        } catch (error) {
          console.error("[Hexagram Explanation Error]", error);
          return {
            success: false,
            explanation: input.judgment,
            isMember: input.isMember,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    
    // Explain Yao Lines (Hexagram lines) in easy-to-understand language
    explainYaoLines: publicProcedure
      .input(
        z.object({
          hexagramName: z.string(),
          yaoLines: z.array(z.string()),
          isMember: z.boolean(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          if (!input.isMember) {
            // Non-members don't get explanations
            return {
              success: true,
              explanations: input.yaoLines,
              isMember: false,
            };
          }

          // Members get AI-generated easy-to-understand explanations for each yao line
          const yaoExplanations = await Promise.all(
            input.yaoLines.map(async (yaoLine, index) => {
              try {
                const prompt = `你是一位精通周易的传统文化学者。用户得到了卦象"${input.hexagramName}"的第${index + 1}爻。

原文爻辞：${yaoLine}

请用通俗易懂的现代语言，用1-2句话解释这条爻辞的含义。避免使用晦涩的古文术语，要让普通人也能理解。

解释要点：
1. 这条爻代表什么状态
2. 对当下生活的实际意义

回答不超过50字。`;

                const response = await callQwen({
                  messages: [
                    {
                      role: "system",
                      content: "你是一位精通周易的传统文化学者，用通俗易懂的语言解释爻辞。",
                    },
                    {
                      role: "user",
                      content: prompt,
                    },
                  ],
                  temperature: 0.7,
                  max_tokens: 100,
                });

                return response.choices[0]?.message.content || yaoLine;
              } catch (error) {
                console.error(`[Yao Line ${index + 1} Explanation Error]`, error);
                return yaoLine;
              }
            })
          );

          return {
            success: true,
            explanations: yaoExplanations,
            isMember: true,
          };
        } catch (error) {
          console.error("[Yao Lines Explanation Error]", error);
          return {
            success: false,
            explanations: input.yaoLines,
            isMember: input.isMember,
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
