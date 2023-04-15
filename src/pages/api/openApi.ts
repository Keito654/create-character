import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `From now on, I will create a character for "Call of Cthulhu RPG". The conditions for creating a character are specified in the "Conditions" segment, so create a "Call of Cthulhu RPG" character accordingly. The output should follow the format given in the "Output" segment.Please output in Japanese.
---Conditions---
・${req.body}

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
`,
        },
      ],
    }),
  });

  const data = await response.json();
  res.json({
    message: data.choices[0].message.content,
  });
};

export default handler;
