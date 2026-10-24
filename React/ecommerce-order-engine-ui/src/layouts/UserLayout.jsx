import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";


function UserLayout() {

  return (

    <div className="shop-layout">

      <Navbar />


      <main className="shop-main">

        <Outlet />

      </main>

    </div>
  );
}


export default UserLayout;