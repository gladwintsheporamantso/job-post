import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://image-job.assemblr.ai/translate-to-english/";

export const translateToEnglish = createAsyncThunk(
  "translate/translateToEnglish",
  async (json_data: object) => {
    try {
      const response = await axios.post(API_URL, { json_data });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || "Translation failed");
      }
      throw new Error("Translation failed");
    }
  }
);

interface TranslateState {
  translatedData: object | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TranslateState = {
  translatedData: null,
  status: "idle",
  error: null,
};

const translateToEnglishSlice = createSlice({
  name: "translate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(translateToEnglish.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(translateToEnglish.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.translatedData = action.payload.translated_data;
      })
      .addCase(translateToEnglish.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      });
  },
});

export default translateToEnglishSlice.reducer;
