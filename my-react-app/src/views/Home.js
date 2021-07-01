import React, { useState, useEffect } from "react";

import {
  Link,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

export default function Home() {
  let { path, url } = useRouteMatch();

  return (
    <>
      <ul>
        <li>
          <Link to={`topic/foo`}>Foo</Link>
        </li>
        <li>
          <Link to={`topic/bar`}>Bar</Link>
        </li>
        <li>
          <Link to={`topic/baz`}>Baz</Link>
        </li>
      </ul>
      {/* <Header /> */}
      <Switch>
        <Route exact path={path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
      {/* <Footer /> */}
    </>
  );
}
