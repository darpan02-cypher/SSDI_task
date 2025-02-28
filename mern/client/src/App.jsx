import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmployeeSearch from "./components/EmployeeSearch";

const App = () => {
  return (
    <div className="w-full p-6">
      <Navbar />
      <div className="my-6">
        <h1>Employee Search</h1>
        <EmployeeSearch /> {/* Employee Search Section */}
      </div>
      <Outlet />
    </div>
  );
};

export default App;