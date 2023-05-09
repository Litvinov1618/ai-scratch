import { Configuration, OpenAIApi } from "openai";
import { IPost } from "./App";
import formatDate from "./formatDate";

const generateAIResponse = async (
  searchValue: string,
  notes: IPost[] | null
) => {
  if (!notes) return;

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You need to give a human-like answer for search request based on given notes. If notes doesn't includes right answer or not enough information, say 'I don't know'. Use only 1-5 sentences in answer.",
      },
      {
        role: "user",
        content: `Question: Adam's birthday? Notes: 1. Date: 9 Oct 2023, 2:00 PM Text: Mom's birthday 6th may 2. Date: 9 Oct 2023, 2:10 PM Text: Happy Birthday to you song need to download 3. Date: 2 Oct 2023, 2:00 PM Text: Adam's Birthday: 04/07/1990`,
      },
      {
        role: "assistant",
        content: "Adam's birthday is on 4th July",
      },

      {
        role: "user",
        content: `Question: Where I was 9th October? Notes: 1. Date: 9 Oct 2023, 2:00 PM Text: "Dark Knight" is amazing movie! 2. Date: 9 May 2023, 2:10 PM Text: Bacarda coffee is amazing place, need to return soon 3. Date: 2 Oct 2023, 2:00 PM Text: Adam's Birthday: 04/07/1990`,
      },
      {
        role: "assistant",
        content: "You were in cinema watching 'Dark Knight' movie",
      },
      {
        role: "user",
        content: `Question: ${searchValue} Notes: ${notes
          .map((note, index) => `${index + 1}. Date: ${formatDate(note.date)} Text: ${note.text}`)
          .join(" ")}`,
      },
    ],
  });

  return completion.data.choices[0].message?.content;
};

export default generateAIResponse;
