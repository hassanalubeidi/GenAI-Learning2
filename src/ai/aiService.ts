import OpenAI from "openai";
import { completeAndParseJSON } from "./finishJSON";

export const openai = new OpenAI({
  organization: "org-pGoOxfwv66fzphnuMlcfljIl",
  dangerouslyAllowBrowser: true,
});

export const threadId = "thread_J4448s1cNS7IQsOoX6rK2qh6"
export const assistant_id = "asst_PYk6c5JZp1kRVk2FiHerEoJq"

export const fillFormWithAI = async (content: string, schema: any, onChunk: any, imDone: any) => {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You will save a user's CV. Do not confirm, only save." },
      { role: "user", content },
    ],
    stream: false,
    functions: [
      schema,
    ],
    stream: true,
  });

  let unfinishedMessage = ''

  for await (const response of stream) {    
    try {
        unfinishedMessage += response.choices[0].delta.function_call.arguments
        onChunk(completeAndParseJSON(unfinishedMessage))
        
    } catch (error) {
      console.error(error)
    } finally {
      imDone()
    }
  }
};