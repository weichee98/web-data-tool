import "./Process.css";
import bgImage from "./img/process-bg.jpg";
import React, { Component } from "react";
import {
  Navigation,
  Header,
  InputPanel,
  DataPanel,
  StatsPanel,
  ProcessPanel,
} from "../components";

class Process extends Component {
  constructor(props) {
    super(props);
    this.inputPanel = React.createRef();
    this.dataPanel = React.createRef();
    this.statsPanel = React.createRef();
    this.processPanel = React.createRef();
    this.processDataPanel = React.createRef();
    this.processStatsPanel = React.createRef();
    this.df = null;
    this.colDtypes = null;
  }

  onLoading = () => {
    this.dataPanel.current.setLoading();
  };

  onError = (error) => {
    this.dataPanel.current.setError(error);
  };

  onChange = (df, colDtypes) => {
    this.df = df;
    this.colDtypes = colDtypes;
    this.dataPanel.current.setDataFrame(this.df);
    this.statsPanel.current.setDataFrame(this.df, this.colDtypes);
    this.processPanel.current.setDataFrame(this.df, this.colDtypes);
  };

  onProcessLoading = () => {
    this.processDataPanel.current.setLoading();
  };

  onProcessError = (error) => {
    this.processDataPanel.current.setError(error);
  };

  onRenderProcessDF = (df, colDtypes) => {
    this.processDataPanel.current.setDataFrame(df);
    this.processStatsPanel.current.setDataFrame(df, colDtypes);
  };

  render() {
    return (
      <div className="process">
        <Navigation active="Process"></Navigation>
        <Header
          text="Data Processing Tool"
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
        <div style={{ paddingTop: "1rem" }}>
          <ProcessPanel
            ref={this.processPanel}
            height="20rem"
            onLoading={this.onProcessLoading}
            onRender={this.onRenderProcessDF}
            onRenderError={this.onProcessError}
          ></ProcessPanel>
        </div>
        <div style={{ display: "flex", paddingBottom: "1rem" }}>
          <div style={{ flex: 5, overflow: "auto" }}>
            <DataPanel
              navigatorHeight="3rem"
              panelHeight="18rem"
              ref={this.processDataPanel}
            ></DataPanel>
          </div>
          <div style={{ flex: 3, overflow: "auto" }}>
            <StatsPanel
              menuHeight="3rem"
              panelHeight="18rem"
              ref={this.processStatsPanel}
            ></StatsPanel>
          </div>
        </div>
      </div>
    );
  }
}

export default Process;
