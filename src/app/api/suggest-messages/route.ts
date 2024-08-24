import axios from "axios";

export async function GET(req: Request) {
  try {
    const prompt = "Create 3 unique, open-ended questions for an anonymous social messaging platform. Each question should spark positive, engaging conversations and be under 100 characters. Use ' || ' between questions. Use emojis at the end of each question . Avoid personal or sensitive topics. Do not number the questions and never include an outro or intro or '\n' character. Keep the total response under 300 characters. "
    
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
      "max_tokens": 256,
      "frequency_penalty": 0,
      "logit_bias": {"2435":-100, "640":-100},
      "logprobs": true,
      "top_logprobs": 1,
      "n": 1,
      "presence_penalty": 0,
      "response_format": { "type": "text" },
      "stop": null,
      "stream": false,
      "temperature": 1.0,
      "top_p": 1
    }, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization":`Bearer ${process.env.AI_API_KEY}`
    }});
  
    return Response.json({ success: true,message: aiRes.data.choices[0].message.content },{status:200});
  } catch (error) {
    console.log("Some error occured",error);
    return Response.json({ success: false, message: "Failed to get suggestions" },{status:500});
  }
}
