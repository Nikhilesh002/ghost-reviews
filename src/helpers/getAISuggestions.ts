import axios from "axios";


export async function getAISuggestions(context:string){

  const prompt = "Think out of the box and generate 3 unique and diverse open-ended questions for an anonymous social messaging platform. Each question should be distinct from the others, encouraging different types of positive and engaging conversations with suitable emojis. Use ' || ' to separate. From these, select 3 varied questions.Do not number the questions and never include an outro or intro or '\n' character. Keep the total response under 300 characters."

    const aiRes = await axios.post(`${process.env.AI_BASE_URL}`,{
      model: `${process.env.AI_MODEL}`,
      messages: [
        {
          role: "system",
          content: `You are a creative assistant skilled in generating engaging content.+ ${context} `
        },
        {
          role: "user",
          content: prompt
        }
      ],
      frequency_penalty: 0,
      logprobs: true,
      top_logprobs: 2,
      max_tokens: 256,
      n: 1,
      presence_penalty: 0,
      response_format: {
        type: "text"
      },
      stream: false,
      temperature: 0,
      top_p: 1
    }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization":`Bearer ${process.env.AI_API_KEY}`
    }});

    return aiRes;
}