/* 
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-03-30    
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
//ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.createRoot(document.getElementById("root")).render(<BrowserRouter><App/></BrowserRouter>);
