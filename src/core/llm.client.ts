import { ChatOpenAI } from "@langchain/openai";

export class LLMClient {
  constructor(
    private readonly modelName = "gpt-4o-mini",
    private readonly temperature = 0.2
  ) {}

  create() {
    return new ChatOpenAI({
      model: this.modelName,
      temperature: this.temperature,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}
