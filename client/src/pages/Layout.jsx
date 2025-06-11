import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <nav>Navigation</nav>
      <Outlet />
    </div>
  );
};

export default Layout;
