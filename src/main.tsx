import React from "react";
import { createRoot } from "react-dom/client";
import { LetterFormProvider } from "./components/LetterForms";
import App from "./App";
import "./styles.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LetterFormProvider>
      <App />
    </LetterFormProvider>
  </React.StrictMode>,
);
if (import.meta.env.PROD && "serviceWorker" in navigator)
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
    scope: import.meta.env.BASE_URL,
  });
