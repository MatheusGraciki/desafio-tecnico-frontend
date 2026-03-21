import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/sass/main.scss";

createRoot(document.getElementById("root")!).render(<App />);
