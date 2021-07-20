import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles/output.css";
import "./styles/custom.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import Header from "components/header.js";

import Home from "views/Home.js";
import About from "views/About.js";
// import Market from "views/Market.js";
import NftDetail from "views/NftDetail.js";

import Store from "./stores/store";
import Marketplace from "views/Marketplace";
const store = Store.store;
const emitter = Store.emitter;
const dispatcher = Store.dispatcher;

function App() {
  useEffect(() => {
    // Some initialization logic here
    dispatcher.dispatch({ type: "CONFIGURE", content: {} });
  }, []);

  return (
    <Router>
      <Header />
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/market">
            <Marketplace />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/nft/:id">
            <NftDetail />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
