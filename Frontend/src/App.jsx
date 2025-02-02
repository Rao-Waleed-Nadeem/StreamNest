import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { Puff } from "react-loader-spinner";
import { useSelector } from "react-redux";

function App() {
  const loading = useSelector((state) => state?.loading?.loading);
  return (
    <>
      <ScrollToTop />
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Puff
            visible={true}
            height="80"
            width="80"
            color="#6C5CE7"
            ariaLabel="puff-loading"
          />
        </div>
      )}

      <Header />
      <Outlet />
    </>
  );
}

export default App;
