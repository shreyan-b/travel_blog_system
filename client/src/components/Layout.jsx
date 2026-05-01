import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [category, setCategory] = useState("All");

  return (
    <>
      <Header />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children(category)}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
