import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Navbar from "./components/Navbar";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";
import AnimePage from "./pages/AnimePage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/anime/:id" element={<AnimePage />} />
      </Routes>
    </BrowserRouter>
  );
}
