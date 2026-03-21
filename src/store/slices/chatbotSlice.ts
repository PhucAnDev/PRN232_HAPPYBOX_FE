import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatbotService, {
  ChatMessageResponse,
} from "../../services/chatbotService";
import { getErrorMessage } from "../../utils/errorMessage";

interface ChatbotState {
  latestResponse: ChatMessageResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatbotState = {
  latestResponse: null,
  loading: false,
  error: null,
};

export const sendChatbotMessage = createAsyncThunk(
  "chatbot/sendChatbotMessage",
  async (message: string, { rejectWithValue }) => {
    try {
      const response = await chatbotService.sendMessage(message);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the gui tin nhan chatbot"),
      );
    }
  },
);

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    clearChatbotError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatbotMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatbotMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.latestResponse = action.payload;
      })
      .addCase(sendChatbotMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearChatbotError } = chatbotSlice.actions;

export default chatbotSlice.reducer;
