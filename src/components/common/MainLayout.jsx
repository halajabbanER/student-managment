import { Outlet } from "react-router-dom";
import Header from "./Header";

function MainLayout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
