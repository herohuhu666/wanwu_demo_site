import axios from "axios";

/**
 * Qwen (通义千问) API integration helper
 * 
 * This helper provides a simple interface to call Qwen API for chat completions.
 * The API key is stored as an environment variable for security.
 */

export interface QwenMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface QwenChatOptions {
  messages: QwenMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface QwenChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call Qwen API for chat completion
 * @param options Chat options including messages, model, temperature, etc.
 * @returns Chat completion response
 */
export async function callQwen(options: QwenChatOptions): Promise<QwenChatResponse> {
  const apiKey = process.env.QWEN_API_KEY;
  
  if (!apiKey) {
    throw new Error("QWEN_API_KEY environment variable is not set");
  }

  const {
    messages,
    model = "qwen-plus",
    temperature = 0.7,
    max_tokens = 2000,
    stream = false,
  } = options;

  try {
    const response = await axios.post<QwenChatResponse>(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        model,
        messages,
        temperature,
        max_tokens,
        stream,
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[Qwen API Error]", error.response?.data || error.message);
      throw new Error(`Qwen API call failed: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}
