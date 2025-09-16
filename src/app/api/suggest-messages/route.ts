import { google } from "@ai-sdk/google";
import { streamText, InvalidPromptError, APICallError } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages: [{ role: "user", content: prompt }],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    if (error instanceof InvalidPromptError) {
      return Response.json(
        {
          success: false,
          message: "The provided prompt was invalid or unsafe",
        },
        { status: 400 }
      );
    } else if (error instanceof APICallError) {
      return Response.json(
        { success: false, message: "API call to Gemini failed" },
        { status: 400 }
      );
    } else {
      console.error("An unexpected error occurred:", error);
      return Response.json(
        { success: false, message: "Unexpected server error" },
        { status: 500 }
      );
    }
  }
}
