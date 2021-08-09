import "./PlotPanel.css";
import React, { Component } from "react";
import { LeftTabs } from "./Tabs";
import PropTypes from "prop-types";
import * as PlotComponent from "./PlotComponent";
import Plot from "react-plotly.js";
import DataFrame from "dataframe-js";
import Spinner from "./Spinner";

class PlotPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      df: new DataFrame([]),
      colDtypes: {},
      name: "noMessage",
      error: null,
      data: null,
      layout: null,
      config: null,
    };
    this.setPlotParams = this.setPlotParams.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  static get propTypes() {
    return {
      height: PropTypes.string,
    };
  }

  setDataFrame(df, colDtypes) {
    this.setState({ df: df, colDtypes: colDtypes });
  }

  setPlotParams(params) {
    if ("config" in params) {
      params["config"]["scrollZoom"] = true;
    }
    this.setState(params);
  }

  setLoading() {
    this.setState({ name: "loading" });
  }

  renderPlot() {
    switch (this.state.name) {
      case "loading":
        return <Spinner></Spinner>;
      case "noMessage":
        return <h5>No plot to display</h5>;
      case "error":
        return <h5>{this.state.error.toString()}</h5>;
      case "plot":
        return (
          <Plot
            data={this.state.data}
            layout={this.state.layout}
            config={this.state.config}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          ></Plot>
        );
      default:
        return undefined;
    }
  }

  render() {
    return (
      <LeftTabs
        height={this.props.height || "auto"}
        tabFlex={2}
        containerFlex={6}
      >
        <div key="plotPanel" className="card-body" style={{ height: "100%" }}>
          <div className="card text-center bg-light plot-panel-container">
            {this.renderPlot()}
          </div>
        </div>
        <PlotComponent.LinePlot
          df={this.state.df}
          colDtypes={this.state.colDtypes}
          key="line"
          label="Line"
          title="Line Plot"
          onLoading={this.setLoading}
          onClick={this.setPlotParams}
        ></PlotComponent.LinePlot>
        <PlotComponent.ScatterPlot
          df={this.state.df}
          colDtypes={this.state.colDtypes}
          key="scatter"
          label="Scatter"
          title="Scatter Plot"
          onLoading={this.setLoading}
          onClick={this.setPlotParams}
        ></PlotComponent.ScatterPlot>
        <PlotComponent.BarChart
          df={this.state.df}
          colDtypes={this.state.colDtypes}
          key="bar"
          label="Bar"
          title="Bar"
          onLoading={this.setLoading}
          onClick={this.setPlotParams}
        ></PlotComponent.BarChart>
        <PlotComponent.BubblePlot
          df={this.state.df}
          colDtypes={this.state.colDtypes}
          key="bubble"
          label="Bubble"
          title="Bubble"
          onLoading={this.setLoading}
          onClick={this.setPlotParams}
        ></PlotComponent.BubblePlot>
        <PlotComponent.AreaPlot
          df={this.state.df}
          colDtypes={this.state.colDtypes}
          key="area"
          label="Area"
          title="Area"
          onLoading={this.setLoading}
          onClick={this.setPlotParams}
        ></PlotComponent.AreaPlot>
        <PlotComponent.BoxPlot
          df={this.state.df}
          colDtypes={this.state.colDtypes}
          key="box"
          label="Box"
          title="Box Plot"
          onLoading={this.setLoading}
          onClick={this.setPlotParams}
        ></PlotComponent.BoxPlot>
        <PlotComponent.Heatmap
          df={this.state.df}
          colDtypes={this.state.colDtypes}
          key="heatmap"
          label="Heatmap"
          title="Heatmap"
          onLoading={this.setLoading}
          onClick={this.setPlotParams}
        ></PlotComponent.Heatmap>
        <PlotComponent.Histogram
          df={this.state.df}
          colDtypes={this.state.colDtypes}
          key="histogram"
          label="Histogram"
          title="Histogram"
          onLoading={this.setLoading}
          onClick={this.setPlotParams}
        ></PlotComponent.Histogram>
      </LeftTabs>
    );
  }
}

export default PlotPanel;
