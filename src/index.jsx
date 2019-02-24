import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

import cookie from "./utils/cookies";

ReactDOM.render(<App {...{ cookie }} />, document.getElementById("root"));
