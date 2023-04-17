"use client";
import { useState } from "react";
import { TextField, Container, Box, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import React from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseArr, setResponse] = useState<string>();

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInput(event.target.value);
  };

  const handleSubmit = async () => {
    setInput((text) => text.trim());
    if (!input) {
      setInput("");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/openApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let currentResponse: string[] = [];

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      currentResponse = [...currentResponse, chunkValue];

      setResponse(currentResponse.join(""));
    }
    setLoading(false);
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4">GPTクトゥルフキャラメーカー</Typography>
      </Box>
      <Box>
        <TextField
          label="キャラクターの説明を入力"
          variant="outlined"
          fullWidth
          value={input}
          onChange={handleChange}
        />
      </Box>
      <Box my={2}>
        <LoadingButton
          endIcon={<SendIcon />}
          variant="contained"
          color="primary"
          loading={loading}
          loadingPosition="end"
          onClick={handleSubmit}
        >
          <span>キャラを作成</span>
        </LoadingButton>
      </Box>
      {responseArr && (
        <Box>
          <Typography variant="h6">生成されたキャラクター:</Typography>
          <Typography>
            {responseArr.split("\n").map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {item}
                  <br />
                </React.Fragment>
              );
            })}
          </Typography>
        </Box>
      )}
    </Container>
  );
}
