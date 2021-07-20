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
      {/* <Marketplace /> */}
      <div className="home">
        <img
          src="https://static.overlay-tech.com/assets/eeb0c8c9-6927-4067-ba89-cc331844f560.svg"
          width="800px"
          height="600px"
          style={{
            position: "absolute",
            left: "440px",
            top: "100px",
          }}
        ></img>
        <div className="flex flex-col">
          <div
            className="flex flex-col m-4 mt-12"
            style={{
              height: "400px",
            }}
          >
            <span
              style={{
                color: "#FFCA0E",
                fontFamily: "Montserrat",
                fontWeight: 1000,
                fontSize: "55px",
                lineHeight: "65px",
              }}
            >
              Own a part of
            </span>
            <span
              style={{
                color: "#FFCA0E",
                fontFamily: "Montserrat",
                fontWeight: 900,
                fontSize: "80px",
                lineHeight: "65px",
              }}
            >
              Planet Earth
            </span>
          </div>
          <div className="flex justify-center mb-2">
            <button
              className="rounded p-4 mr-2 ml-2"
              style={{
                background: "#FFFFFF",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                borderRadius: "90px",
              }}
            >
              <span
                className="text-4xl"
                style={{
                  color: "#FFCA0E",
                  fontFamily: "Montserrat",
                  fontWeight: 900,
                  fontStyle: "normal",
                  lineHeight: "96%",
                }}
              >
                Explore
              </span>
            </button>
          </div>
          <hr />
          <div className="flex flex-col">
            <div className="px-8 mt-4 flex justify-center">
              <span class="text-4xl font-semibold">Browse By</span>
            </div>

            <div className="px-8 mt-4 flex flex-row w-100 justify-center space-x-8">
              <div
                className="rounded-lg flex flex-col cursor-pointer"
                style={{
                  width: "300px",
                  height: "250px",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div
                  className="bg-purple-400 m-2 mb-0"
                  style={{ height: "80%" }}
                ></div>
                <div className="flex justify-center" style={{ height: "20%" }}>
                  <span
                    className="text-xl self-center"
                    style={{
                      color: "#FFCA0E",
                      fontFamily: "Montserrat",
                      fontWeight: 900,
                      fontStyle: "normal",
                      lineHeight: "96%",
                    }}
                  >
                    COUNTRY
                  </span>
                </div>
              </div>
              <div
                className="rounded-lg flex flex-col cursor-pointer"
                style={{
                  width: "300px",
                  height: "250px",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div
                  className="bg-purple-400 m-2 mb-0"
                  style={{ height: "80%" }}
                ></div>
                <div className="flex justify-center" style={{ height: "20%" }}>
                  <span
                    className="text-xl self-center"
                    style={{
                      color: "#FFCA0E",
                      fontFamily: "Montserrat",
                      fontWeight: 900,
                      fontStyle: "normal",
                      lineHeight: "96%",
                    }}
                  >
                    CITY
                  </span>
                </div>
              </div>
              <div
                className="rounded-lg flex flex-col cursor-pointer"
                style={{
                  width: "300px",
                  height: "250px",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div
                  className="bg-purple-400 m-2 mb-0"
                  style={{ height: "80%" }}
                ></div>
                <div className="flex justify-center" style={{ height: "20%" }}>
                  <span
                    className="text-xl self-center"
                    style={{
                      color: "#FFCA0E",
                      fontFamily: "Montserrat",
                      fontWeight: 900,
                      fontStyle: "normal",
                      lineHeight: "96%",
                    }}
                  >
                    LANDMARK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
