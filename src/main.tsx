import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");

  if (import.meta.env.MODE !== "development") {
    return worker.start({
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });
  }

  return worker.start();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
