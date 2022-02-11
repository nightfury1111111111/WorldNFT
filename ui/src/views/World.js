import { useEffect, useMemo, useState } from "react";
import Map from "../components/Map";
import { useLocalState } from "utils/useLocalState";

export default function World() {
  const [dataBounds, setDataBounds] = useLocalState("bounds", "[[0,0],[0,0]]");
  return <Map setDataBounds={setDataBounds} nfts={[]} />;
}
