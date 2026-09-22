import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from "./store/index.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import ErrorBoundary from "./components/ErrorBoundary.jsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={googleClientId}>
          {/* <ErrorBoundary> */}
          <App />
          {/* </ErrorBoundary> */}
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>,
);
