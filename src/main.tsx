import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Watermark } from "antd";
import "@/styles/theme.scss";
import "virtual:svg-icons-register";
import '@/utils/noWarnning.ts';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Watermark content="">
    <App />
  </Watermark>
);
