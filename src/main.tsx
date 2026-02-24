import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./store/store";
import App from "./App.tsx";
import "./index.css";

const GOOGLE_CLIENT_ID =
  "976426394148-eub0i02sbrseoob7r4lbe8ubr3bqv3n2.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </Provider>,
);
