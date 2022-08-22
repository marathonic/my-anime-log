import "./style.css";
import Header from "./components/Header";
import { Headr, AppContainer } from "./components/primedComps";
import { FaUser } from "react-icons/fa";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AppContainer>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;
