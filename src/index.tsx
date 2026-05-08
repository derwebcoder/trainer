import "./style.css";
import { createRoot } from "react-dom/client";
import { Main } from "./main";

const root = createRoot(document.getElementById("app")!);
root.render(<Main />);
