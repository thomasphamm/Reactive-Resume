/* eslint-disable lingui/text-restrictions */

import { t } from "@lingui/macro";

import { openai } from "./client";

const PROMPT = `Generate me a summary, with the above information. Can you write a 200 words?
Text: """{input}"""
Revised Text: """`;

export const createSummary = async (data: any) => {
  const text = Object.keys(data).map((key) => {
    if(key === 'id') return;
    return data[key];
  }).join(', ')
  const prompt = PROMPT.replace("{input}", text);
  console.log(prompt);
  

  const result = await openai().chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    max_tokens: 1024,
    temperature: 0,
    // stop: ['"""'],
    n: 1,
  });

  if (result.choices.length === 0) {
    throw new Error(t`OpenAI did not return any choices for your text.`);
  }

  return result.choices[0].message.content ?? text;
};
