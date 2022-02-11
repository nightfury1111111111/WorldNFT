// import React, { useRef, useState } from "react";
// import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import { useLocalState } from "../utils/useLocalState";
// // import { SearchBox } from "../components/searchBox";

// const Map = ({ setDataBounds, nfts }) => {
//   const [selected, setSelected] = useState(null);
//   const mapRef = useRef();
//   const [viewport, setViewport] = useLocalState("viewport", {
//     latitude: 43,
//     longitude: -79,
//     zoom: 10,
//   });

//   return (
//     <div className="text-black relative">
//       <ReactMapGL
//         {...viewport}
//         width="100%"
//         height="calc(100vh - 64px)"
//         mapboxApiAccessToken={process.env.REACT_PUBLIC_MAPBOX_API_TOKEN}
//         onViewportChange={(nextViewport) => setViewport(nextViewport)}
//         ref={(instance) => (mapRef.current = instance)}
//         minZoom={0}
//         maxZoom={15}
//         mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
//         onLoad={() => {
//           if (mapRef.current) {
//             const bounds = mapRef.current.getMap().getBounds();
//             setDataBounds(JSON.stringify(bounds.toArray()));
//           }
//         }}
//         onInteractionStateChange={(extra) => {
//           if (!extra.isDragging && mapRef.current) {
//             const bounds = mapRef.current.getMap().getBounds();
//             setDataBounds(JSON.stringify(bounds.toArray()));
//           }
//         }}
//       >
//         {/* <div className="absolute top-0 w-full z-10 p-4">
//           <SearchBox
//             defaultValue=""
//             onSelectAddress={(_address, latitude, longitude) => {
//               if (latitude && longitude) {
//                 setViewport((old) => ({
//                   ...old,
//                   latitude,
//                   longitude,
//                   zoom: 12,
//                 }));
//                 if (mapRef.current) {
//                   const bounds = mapRef.current.getMap().getBounds();
//                   setDataBounds(JSON.stringify(bounds.toArray()));
//                 }
//               }
//             }}
//           />
//         </div> */}
//         {/* {nfts?.map((nft) => (
//           <Marker
//             key={nft.tokenId}
//             latitude={nft?.attributes?.latitude}
//             longitude={nft?.attributes?.longitude}
//             offsetLeft={-15}
//             offsetTop={-15}
//             className={highlightedId === nft.tokenId ? "marker-active" : ""}
//           >
//             <button
//               style={{ width: "30px", height: "30px", fontSize: "30px" }}
//               type="button"
//               onClick={() => setSelected(nft)}
//             >
//               <img
//                 src={
//                   highlightedId === nft.tokenId
//                     ? "/map-pin-selected.svg"
//                     : "/map-pin.svg"
//                 }
//                 alt="nft"
//                 className="w-8"
//               ></img>
//             </button>
//           </Marker>
//         ))} */}
//       </ReactMapGL>
//     </div>
//   );
// };

// export default Map;

import { Component } from "react";
import ReactMapGL from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

class Map extends Component {
  state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 10,
    },
  };

  render() {
    return (
      <div className="text-black relative">
        <ReactMapGL
          {...this.state.viewport}
          width="100%"
          height="calc(100vh - 64px)"
          onViewportChange={(viewport) => this.setState({ viewport })}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        />
      </div>
    );
  }
}

export default Map;
