import { OpenAIStream, OpenAIStreamPayload } from "../../utils/openAIStream";

type RequestData = {
  message: string;
};

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const runtime = "edge";

const handler = async (req: Request) => {
  const { message } = (await req.json()) as RequestData;

  const prompt = `From now on, I will create a character for "Call of Cthulhu RPG". The conditions for creating a character are specified in the "Conditions" segment, so create a "Call of Cthulhu RPG" character accordingly. The output should follow the format given in the "Output" segment.Please output in Japanese.
---Conditions---
・${message}

---Output---
キャラクター名：{Character name}
職業: {Job}
性別:{Sex}
経歴:{Career}
性格：{Personality}

経歴や性格の詳しい説明: {Detail career and personality}

能力値
STR:{str number, 2~18}
CON: {con number, 2~18}
POW: {pow number, 2~18}
DEX: {dex number, 2~18}
APP: {app number, 2~18}
SIZ: {siz number, 2~18}
INT: {int number, 2~18}
EDU: {edu number, 3~21}

技能
{skill name}: {skill point number, 1~90}
`;

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
