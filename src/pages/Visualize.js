import "./Visualize.css";
import React, { Component } from "react";
import DataPanel from "../components/DataPanel";
import InputPanel from "../components/InputPanel";

class Visualize extends Component {
  constructor(props) {
    super(props);
    this.inputPanel = React.createRef();
    this.dataPanel = React.createRef();
    this.df = null;
    this.col_dtypes = null;
  }

  onLoading = () => {
    this.dataPanel.current.setLoading();
  };

  onError = (error) => {
    this.dataPanel.current.setError(error);
  };

  onChange = (df, col_dtypes) => {
    this.df = df;
    this.col_dtypes = col_dtypes;
    this.dataPanel.current.setDataFrame(this.df);
  };

  render() {
    return (
      <div className="visualize">
        <nav className="navbar navbar-expand-lg navbar-dark main-navbar">
          <div className="navbar-nav">
            <a className="navbar-item nav-link" href="/">
              Home
            </a>
            <a className="navbar-item nav-link" href="/process">
              Process
            </a>
            <a className="navbar-item nav-link active" href="/visualize">
              Visualize
            </a>
          </div>
        </nav>
        <div
          className="bs-docs-header bg-dark header-title"
          id="visualize-header"
        >
          <div className="container">
            <h1 className="display-3 text-white">Data Visualization Tool</h1>
          </div>
        </div>
        <InputPanel
          onLoading={this.onLoading}
          onError={this.onError}
          onChange={this.onChange}
          ref={this.inputPanel}
        ></InputPanel>
        <DataPanel panelHeight="30rem" ref={this.dataPanel}></DataPanel>
      </div>
    );
  }
}

export default Visualize;
