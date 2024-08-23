import axios from "axios";

export async function GET(req: Request) {
  try {
    const prompt = " Create a list of three creative,unique,open-ended and engaging questions formatted as a single string. Each question should be separated by '||'.Each question must be within 100 characters. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. Dont give any intro, outro to response. Dont add serial number or index or any number at all. Generatre questions different from example. Overall response must not exceed 300 characters . For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment' "
    
    const aiRes = await axios.post(`${process.env.AI_BASE_URL}`,{
      "model": process.env.MODEL,
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful and creative assistant, you get lot of questions"
        },
        {
          "role": "user",
          "content":prompt
        }
      ],
      "max_tokens": 512,
      "frequency_penalty": 0,
      "logit_bias": {"2435":-100, "640":-100},
      "logprobs": true,
      "top_logprobs": 1,
      "n": 1,
      "presence_penalty": 0,
      "response_format": { "type": "text" },
      "stop": null,
      "stream": false,
      "temperature": 1.2,
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
