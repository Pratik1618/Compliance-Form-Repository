import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import Layout from "./Components/Layout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Layout/>
    </>
  );
}

export default App;
