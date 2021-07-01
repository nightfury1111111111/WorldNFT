import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import Home from "./views/Home";
import About from "./views/About.js";
// import App from './App';
// import reportWebVitals from './reportWebVitals';

function App() {
  useEffect(() => {
    // Some initialization logic here
    // dispatcher.dispatch({ type: "CONFIGURE", content: {} });
  }, []);

  return (
    <Router>
      {/* <Header /> */}
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          {/* <Route path="/nft/:id">
			  <NftAuction />
			</Route> */}
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
