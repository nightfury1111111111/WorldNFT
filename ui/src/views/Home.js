import React, { useState, useEffect } from "react";

import {
  Link,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import { country_icon_svg, city_icon_svg, landmark_icon_svg } from "./icons";
import countryPic from "../assets/img/country.png";
import cityPic from "../assets/img/city.png";
import landmarkPic from "../assets/img/landmark.png";

export default function Home() {
  let { path, url } = useRouteMatch();
  return (
    <>
      {/* <Marketplace /> */}
      <div className="home">
        <img
          src="https://static.overlay-tech.com/assets/eeb0c8c9-6927-4067-ba89-cc331844f560.svg"
          width="800px"
          height="600px"
          className="map"
        ></img>
        <div className="flex flex-col">
          <div className="flex flex-col m-4 mt-12 banner">
            <div className="earthsvg">
              <div style={{ fontSize: "30px" }}>OWN A PART OF</div>
              <div style={{ fontSize: "30px" }}>THE METAVERSE</div>
            </div>
          </div>
          <div className="flex justify-start mb-2 ml-8">
            <Link
              to={`/market`}
              className="rounded p-3 mr-2 ml-10 mb-2"
              style={{
                background: "#000000",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                borderRadius: "20px",
                zIndex: 10,
              }}
            >
              <span
                className="text-4xl"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "Archivo Black",
                  fontWeight: 900,
                  fontStyle: "normal",
                  lineHeight: "96%",
                  fontSize: "45px",
                }}
              >
                🗺
              </span>
            </Link>
          </div>
          <hr />
          <div className="flex flex-col">
            <div className="px-8 mt-4 flex justify-center">
              <span
                className="text-4xl font-semibold"
                style={{ fontFamily: "Archivo Black" }}
              >
                👀 BY
              </span>
            </div>

            <div className="px-8 mt-4 mb-5 flex flex-row w-100 justify-center space-x-8 nftmenu">
              <div style={{ display: "flex", marginBottom: "18px" }}>
                <div
                  className="rounded-lg flex flex-col cursor-pointer nftitem"
                  style={{
                    width: "300px",
                    height: "250px",
                    boxShadow: "0px 2px 4px rgba(255, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="bg-purple-400 m-2 mb-0"
                    style={{
                      height: "80%",
                      backgroundImage: `url(${countryPic})`,
                    }}
                  >
                    {country_icon_svg}
                    {/* <img src={countryPic} /> */}
                  </div>
                  <div
                    className="flex justify-center"
                    style={{ height: "20%" }}
                  >
                    <span
                      className="text-xl self-center"
                      style={{
                        color: "#FFCA0E",
                        fontFamily: "Montserrat",
                        fontWeight: 900,
                        fontStyle: "normal",
                        lineHeight: "96%",
                        fontSize: "30px",
                      }}
                    >
                      🏠
                    </span>
                  </div>
                </div>
                <Link
                  to={`/market`}
                  className="rounded-lg flex flex-col cursor-pointer nftitems"
                >
                  <div
                    className="bg-purple-400 m-2 mb-0"
                    style={{ height: "80%" }}
                  >
                    {city_icon_svg}
                  </div>
                  <div
                    className="flex justify-center"
                    style={{ height: "20%" }}
                  >
                    <span
                      className="text-xl self-center"
                      style={{
                        color: "#FFCA0E",
                        fontFamily: "Montserrat",
                        fontWeight: 900,
                        fontStyle: "normal",
                        lineHeight: "96%",
                        fontSize: "30px",
                      }}
                    >
                      🏩
                    </span>
                  </div>
                </Link>
                <div
                  className="rounded-lg flex flex-col cursor-pointer"
                  style={{
                    width: "300px",
                    height: "250px",
                    boxShadow: "0px 2px 4px rgba(255, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="bg-purple-400 m-2 mb-0"
                    style={{ height: "80%" }}
                  >
                    {landmark_icon_svg}
                  </div>
                  <div
                    className="flex justify-center"
                    style={{ height: "20%" }}
                  >
                    <span
                      className="text-xl self-center"
                      style={{
                        color: "#FFCA0E",
                        fontFamily: "Montserrat",
                        fontWeight: 900,
                        fontStyle: "normal",
                        lineHeight: "96%",
                        fontSize: "30px",
                      }}
                    >
                      🗽
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  className="rounded-lg flex flex-col cursor-pointer"
                  style={{
                    width: "300px",
                    height: "250px",
                    boxShadow: "0px 2px 4px rgba(255, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="bg-purple-400 m-2 mb-0"
                    style={{ height: "80%" }}
                  >
                    {landmark_icon_svg}
                  </div>
                  <div
                    className="flex justify-center"
                    style={{ height: "20%" }}
                  >
                    <span
                      className="text-xl self-center"
                      style={{
                        color: "#FFCA0E",
                        fontFamily: "Montserrat",
                        fontWeight: 900,
                        fontStyle: "normal",
                        lineHeight: "96%",
                        fontSize: "30px",
                      }}
                    >
                      🏬
                    </span>
                  </div>
                </div>
                <div
                  className="rounded-lg flex flex-col cursor-pointer"
                  style={{
                    width: "300px",
                    height: "250px",
                    boxShadow: "0px 2px 4px rgba(255, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="bg-purple-400 m-2 mb-0"
                    style={{ height: "80%" }}
                  >
                    {landmark_icon_svg}
                  </div>
                  <div
                    className="flex justify-center"
                    style={{ height: "20%" }}
                  >
                    <span
                      className="text-xl self-center"
                      style={{
                        color: "#FFCA0E",
                        fontFamily: "Montserrat",
                        fontWeight: 900,
                        fontStyle: "normal",
                        lineHeight: "96%",
                        fontSize: "30px",
                      }}
                    >
                      🏟
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
