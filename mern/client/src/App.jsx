import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="w-full p-9">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default App;
