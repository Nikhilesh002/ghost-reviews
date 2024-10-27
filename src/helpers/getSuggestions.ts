import axios from "axios";


export async function getSuggestions(){

  const prompt = "Think out of the box and generate 3 unique and diverse open-ended questions for an anonymous social messaging platform. Each question should be distinct from the others, encouraging different types of positive and engaging conversations with suitable emojis. Use ' || ' to separate. From these, select 3 varied questions.Do not number the questions and never include an outro or intro or '\n' character. Keep the total response under 300 characters."

    const aiRes = await axios.post(`${process.env.AI_BASE_URL}`,{
      "model": `${process.env.MODEL}`,
      "messages": [
        {
          "role": "system",
          "content": "You are a creative assistant skilled in generating engaging content."
        },
        {
          "role": "user",
          "content": prompt
        }
      ],
      "max_tokens": 128,
      "frequency_penalty": 0,
      "logit_bias": {"2435":-100, "640":-100},
      "logprobs": true,
      "top_logprobs": 1,
      "n": 1,
      "presence_penalty": 0,
      "response_format": { "type": "text" },
      // "stop": null,
      "stream": false,
      "temperature": 0.9,
      "top_p": 0.9
    }, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization":`Bearer ${process.env.AI_API_KEY}`
    }});

    return aiRes;
}