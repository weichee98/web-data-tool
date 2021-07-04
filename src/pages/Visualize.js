import "./Visualize.css";
import bgImage from "./img/visualize-bg.jpg";
import React, { Component } from "react";
import {
  Navigation,
  Header,
  InputPanel,
  DataPanel,
  StatsPanel,
} from "../components";

class Visualize extends Component {
  constructor(props) {
    super(props);
    this.inputPanel = React.createRef();
    this.dataPanel = React.createRef();
    this.statsPanel = React.createRef();
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
    this.statsPanel.current.setDataFrame(this.df, this.col_dtypes);
  };

  render() {
    return (
      <div className="visualize">
        <Navigation active="Visualize"></Navigation>
        <Header
          text="Data Visualization Tool"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></Header>
        <InputPanel
          onLoading={this.onLoading}
          onError={this.onError}
          onChange={this.onChange}
          ref={this.inputPanel}
        ></InputPanel>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 5, overflow: "auto" }}>
            <DataPanel
              navigatorHeight="4rem"
              panelHeight="30rem"
              ref={this.dataPanel}
            ></DataPanel>
          </div>
          <div style={{ flex: 3, overflow: "auto" }}>
            <StatsPanel
              menuHeight="4rem"
              panelHeight="30rem"
              ref={this.statsPanel}
            ></StatsPanel>
          </div>
        </div>
      </div>
    );
  }
}

export default Visualize;
