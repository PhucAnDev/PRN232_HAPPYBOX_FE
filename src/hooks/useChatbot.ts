import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  clearChatbotError,
  sendChatbotMessage,
} from "../store/slices/chatbotSlice";

const useChatbot = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chatbot = useSelector((state: RootState) => state.chatbot);

  return {
    ...chatbot,
    sendMessage: (message: string) =>
      dispatch(sendChatbotMessage(message)).unwrap(),
    clearError: () => dispatch(clearChatbotError()),
  };
};

export default useChatbot;
