import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmployeeSearch from "./components/EmployeeSearch"; // Import the search component

const App = () => {
  return (
    <div className="w-full p-6">
      <Navbar />
      <div className="my-6">
        <EmployeeSearch /> {/* Employee Search Section */}
      </div>
      <Outlet />
    </div>
  );
};

export default App;