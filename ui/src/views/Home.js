import React, { useState, useEffect } from "react";

import {
  Link,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import Marketplace from "./Marketplace";

export default function Home() {
  let { path, url } = useRouteMatch();

  return (
    <>
      <Marketplace />
    </>
  );
}
