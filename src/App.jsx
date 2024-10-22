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
import RequireAuth from "./components/RequireAuth.jsx";
import PersistLogin from "./components/PersistLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes  */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />

        {/* protected routes  */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/editor" element={<Ide />} />
            <Route path="/records" element={<Record />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
