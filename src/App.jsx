import { Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./components/layout.jsx";
import Ide from "./components/Editor.jsx";
import Home from "./components/Home.jsx";
import Register from "./components/Register.jsx";
import Record from "./components/Records.jsx";
import Login from "./components/login.jsx";
import Pricing from "./components/Pricing.jsx";
import Contact from "./components/Contact.jsx";
// import Test from "./components/Test.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/editor" element={<Ide />} />
        <Route path="/record" element={<Record />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/testing" element={<Test />} /> */}
      </Route>
    </Routes>
  );
}
