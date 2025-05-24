import React from "react";
import Navbar from "./components/Navbar";
import { useLocation, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./components/AllRooms";
import RoomDetails from "./components/RoomDetails";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div>
      {!isOwnerPath && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/rooms" element={<AllRooms />}></Route>
          <Route path="/rooms/:id" element={<RoomDetails />}></Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
