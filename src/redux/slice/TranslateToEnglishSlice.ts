import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://image-job.assemblr.ai/translate-to-english/";

export const translateToEnglish = createAsyncThunk(
  "translate/translateToEnglish",
  async (json_data: object, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, { json_data });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "Translation failed");
      }
      return rejectWithValue("Translation Failed");
    }
  }
);

interface TranslateState {
  original: object | null;
  translated: object | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isEnglish: boolean;
}

const initialState: TranslateState = {
  original: null,
  translated: null,
  status: "idle",
  error: null,
  isEnglish: false,
};

const translateSlice = createSlice({
  name: "translate",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.isEnglish = !state.isEnglish;
    },
    setOriginalData: (state, action) => {
      state.original = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(translateToEnglish.pending, (state) => {
        state.status = "loading";
      })
      .addCase(translateToEnglish.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.translated = action.payload;
      })
      .addCase(translateToEnglish.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { toggleLanguage, setOriginalData } = translateSlice.actions;

export default translateSlice.reducer;
