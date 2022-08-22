import "./style.css";
import Header from "./components/Header";
import { Headr, AppContainer } from "./components/primedComps";
import { FaUser } from "react-icons/fa";

function App() {
  return (
    <AppContainer>
      <Headr>
        <span className="cursor">MyAnimeLog</span>
        <FaUser className="cursor" />
      </Headr>
    </AppContainer>
  );
}

export default App;
