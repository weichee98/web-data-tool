import "./Home.css";
import React from "react";
import homeBackground from "./img/home-bg.jpg";
// import processBackground from "./img/process-bg.jpg";
import visualizeBackground from "./img/visualize-bg.jpg";

function MainMenuButton(title, content, background, href) {
  return (
    <div className="card-body main-menu">
      <a
        className="btn card text-center main-menu-button"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPositionY: "center",
        }}
        href={href}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem 0",
          }}
        >
          <div className="container display-4 text-white">{title}</div>
          <p className="container text-white">{content}</p>
        </div>
      </a>
    </div>
  );
}

function Home() {
  return (
    <div className="home">
      <div
        className="bs-docs-header bg-dark main-menu-title"
        style={{ backgroundImage: `url(${homeBackground})` }}
      >
        <div className="container">
          <h1 className="display-2 text-white">Web Data Tool</h1>
        </div>
      </div>
      <div className="bg-dark index-content">
        {MainMenuButton(
          "Data Visualization",
          `Plot various kinds of graphs such as line graphs, bar charts,
            scatter plots and etc to visualize the content of imported data.
            Plots are interactive such that they are able to be zoomed,
            dragged and hover across for viewing data values. Plots can also
            be downloaded as PNG files.`,
          visualizeBackground,
          "/visualize"
        )}
      </div>
    </div>
  );
}

export default Home;
