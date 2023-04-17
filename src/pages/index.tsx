"use client";
import { useState } from "react";
import { TextField, Container, Box, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import { styled } from "@mui/system";
import Image from "next/image";

const StyledContainer = styled(Container)({
  textAlign: "center",
  padding: "2rem",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  marginTop: "1rem",
  marginBottom: "1rem",
});

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseArr, setResponse] = useState<string>();
  const [isError, setIsError] = useState(false);
  const [helpText, setHelpText] = useState<string | undefined>();

  const maxLength = 50;

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.target.value.length > maxLength) {
      setIsError(true);
      setHelpText(
        `キャラクターの説明は${maxLength}文字以内で入力してください。`
      );
    } else {
      setIsError(false);
      setHelpText(undefined);
    }
    setInput(event.target.value);
  };

  const handleSubmit = async () => {
    setInput((text) => text.trim());
    if (!input) {
      setIsError(true);
      setHelpText("文字を入力していないか、空白のみの入力です。");
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
    <StyledContainer maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="div">
          <Box component="span" fontWeight="fontWeightMedium">
            GPT
          </Box>
          クトゥルフキャラメーカー
        </Typography>
      </Box>
      <Box>
        <TextField
          label={`キャラクターの説明を入力(${maxLength}文字以内)`}
          variant="outlined"
          fullWidth
          value={input}
          onChange={handleChange}
          error={isError}
          helperText={isError && helpText}
        />
      </Box>
      <Box my={3}>
        <LoadingButton
          endIcon={<SendIcon />}
          variant="contained"
          color="primary"
          loading={loading}
          loadingPosition="end"
          onClick={handleSubmit}
          disabled={input.length > maxLength}
          sx={{
            padding: "0.5rem 1.5rem",
            fontSize: "1.2rem",
          }}
        >
          <span>キャラを作成</span>
        </LoadingButton>
      </Box>
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        生成されたキャラクター
      </Typography>
      <TextField
        multiline
        fullWidth
        placeholder="生成されたキャラクターの説明がここに出力されます"
        value={responseArr}
        InputProps={{
          readOnly: true,
        }}
        variant="outlined"
        sx={{ marginBottom: 3 }}
      />
    </StyledContainer>
  );
}
