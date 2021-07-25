import "./Home.css";
import React from "react";
import homeBackground from "./img/home-bg.jpg";
// import processBackground from "./img/process-bg.jpg";
import visualizeBackground from "./img/visualize-bg.jpg";

function Home() {
  return (
    <div className="home">
      <div
        className="bs-docs-header bg-dark main-menu-title"
        style={{ backgroundImage: `url(${homeBackground})` }}
      >
        <div className="container">
          <h1 className="display-2 text-white">
            Data Processing and Visualization Tool
          </h1>
        </div>
      </div>
      <div className="bg-light index-content">
        <div className="card-body main-menu">
          <a
            className="btn card text-center main-menu-button"
            style={{
              backgroundImage: `url(${visualizeBackground})`,
              backgroundSize: "cover",
            }}
            href="/visualize"
          >
            <h2 className="display-4 text-white">Data Visualization</h2>
            <p className="text-white">
              Plot various kinds of graphs such as line graphs, bar charts,
              scatter plots and etc to visualize the content of imported data.
              Plots are interactive such that they are able to be zoomed,
              dragged and hover across for viewing data values. Plots can also
              be downloaded as PNG files.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
