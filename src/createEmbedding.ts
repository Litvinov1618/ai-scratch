import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const createEmbedding = async (text: string) => {
    const result = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: text,
    })


    return result.data.data[0].embedding;
}

export default createEmbedding;