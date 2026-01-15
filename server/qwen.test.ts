import { describe, expect, it } from "vitest";
import { callQwen } from "./_core/qwen";

describe("Qwen API Integration", () => {
  it("should successfully call Qwen API with valid credentials", async () => {
    const response = await callQwen({
      messages: [
        { role: "system", content: "你是一个有帮助的助手。" },
        { role: "user", content: "你好" },
      ],
      max_tokens: 50,
    });

    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(response.choices.length).toBeGreaterThan(0);
    expect(response.choices[0]?.message.content).toBeTruthy();
    expect(typeof response.choices[0]?.message.content).toBe("string");
  }, 30000); // 30 seconds timeout for API call
});
