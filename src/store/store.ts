import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import catalogReducer from "./slices/catalogSlice";
import orderReducer from "./slices/orderSlice";
import dashboardReducer from "./slices/dashboardSlice";
import voucherReducer from "./slices/voucherSlice";
import userReducer from "./slices/userSlice";
import chatbotReducer from "./slices/chatbotSlice";
import addressReducer from "./slices/addressSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    catalog: catalogReducer,
    orders: orderReducer,
    dashboard: dashboardReducer,
    vouchers: voucherReducer,
    users: userReducer,
    chatbot: chatbotReducer,
    address: addressReducer,
  },
});

// Types cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
