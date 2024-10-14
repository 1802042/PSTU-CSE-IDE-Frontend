import { Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./components/layout.jsx";
import Ide from "./components/Editor.jsx";
import Home from "./components/Home.jsx";
import Register from "./components/Register.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/editor" element={<Ide />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
