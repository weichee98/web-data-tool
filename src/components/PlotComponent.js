import "./PlotComponent.css";
import React, { Component } from "react";
import PropTypes from "prop-types";
import MultiRef from "react-multi-ref";
import { SingleSelect, MultiSelect } from "./Input";
import DTypes from "../utils/DataTypes";

const TIMEOUT = 100;

class Orientation {
  static get VERTICAL() {
    return "v";
  }
  static get HORIZONTAL() {
    return "h";
  }
}

class PlotComponent extends Component {
  constructor(props) {
    super(props);
    this.inputs = new MultiRef();
  }

  static get propTypes() {
    return {
      df: PropTypes.object.isRequired,
      colDtypes: PropTypes.object.isRequired,
      label: PropTypes.string,
      title: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      onLoading: PropTypes.func.isRequired,
    };
  }

  getHue(col_name, element) {
    var temp;
    if (DTypes.dtype(element) == DTypes.UNDEFINED) {
      temp = this.props.df.filter(
        (row) => DTypes.dtype(row.get(col_name)) == DTypes.UNDEFINED
      );
    } else {
      temp = this.props.df.filter((row) => row.get(col_name) == element);
    }
    return temp;
  }

  get children() {
    throw new Error("Not implemented");
  }

  /**
   * name: "error", "plot"
   * data: []
   * layout: {}
   * config: {}
   * error: Error
   */
  getPlotParams() {
    throw new Error("Not implemented");
  }

  render() {
    return (
      <div className="tab-pane card-body text-center">
        <h5>{this.props.title}</h5>
        {this.children}
        <button
          className="btn btn-primary text-center"
          onClick={() => {
            this.props.onLoading();
            setTimeout(() => {
              const params = this.getPlotParams();
              this.props.onClick(params);
            }, TIMEOUT);
          }}
        >
          Plot
        </button>
      </div>
    );
  }
}

export class LinePlot extends PlotComponent {
  constructor(props) {
    super(props);
  }

  get children() {
    return [
      <SingleSelect
        key="x"
        label="x"
        options={Object.keys(this.props.colDtypes).filter(
          (column) =>
            this.props.colDtypes[column] == DTypes.INTEGER ||
            this.props.colDtypes[column] == DTypes.FLOAT ||
            this.props.colDtypes[column] == DTypes.DATE
        )}
        ref={this.inputs.ref("x")}
      ></SingleSelect>,
      <MultiSelect
        key="y"
        label="y"
        options={Object.keys(this.props.colDtypes).filter(
          (column) =>
            this.props.colDtypes[column] == DTypes.INTEGER ||
            this.props.colDtypes[column] == DTypes.FLOAT ||
            this.props.colDtypes[column] == DTypes.DATE
        )}
        ref={this.inputs.ref("y")}
      ></MultiSelect>,
      <SingleSelect
        key="hue"
        label="hue"
        options={[""].concat(Object.keys(this.props.colDtypes))}
        ref={this.inputs.ref("hue")}
      ></SingleSelect>,
    ];
  }

  getPlotParams() {
    var inputValues = {};
    this.inputs.map.forEach((input, name) => {
      inputValues[name] = input.value;
    });
    try {
      return this.line(inputValues);
    } catch (error) {
      return {
        name: "error",
        error: error,
      };
    }
  }

  line(inputValues) {
    var layout = {};
    var config = {};
    var data = [];
    const { x, y, hue } = inputValues;

    if (y.length == 0) {
      return {
        name: "error",
        error: new Error("y not selected"),
      };
    } else if (y.length == 1) {
      if (hue == "") {
        data.push({
          x: this.props.df.toArray(x),
          y: this.props.df.toArray(y[0]),
          type: "scattergl",
          mode: "line",
        });
      } else {
        const hueVal = this.props.df.unique(hue).toArray(hue);
        hueVal.forEach((element) => {
          var trace = {
            type: "scattergl",
            mode: "line",
            name: element,
          };
          var temp = this.getHue(hue, element);
          trace["x"] = temp.toArray(x);
          trace["y"] = temp.toArray(y[0]);
          data.push(trace);
        });
        layout["legend"] = { title: { text: hue } };
      }
      layout["xaxis"] = { title: x, zeroline: false };
      layout["yaxis"] = { title: y[0], zeroline: false };
    } else {
      if (hue != "") {
        return {
          name: "error",
          error: new Error("y must have only 1 column when hue is selected"),
        };
      }
      y.forEach((c_name) => {
        var trace = {
          x: this.props.df.toArray(x),
          y: this.props.df.toArray(c_name),
          name: c_name,
          mode: "line",
          type: "scattergl",
        };
        data.push(trace);
      });
      layout["xaxis"] = { title: x, zeroline: false };
    }
    return {
      name: "plot",
      data: data,
      layout: layout,
      config: config,
    };
  }
}

export class ScatterPlot extends PlotComponent {
  constructor(props) {
    super(props);
  }

  get children() {
    return [
      <SingleSelect
        key="x"
        label="x"
        options={Object.keys(this.props.colDtypes)}
        ref={this.inputs.ref("x")}
      ></SingleSelect>,
      <SingleSelect
        key="y"
        label="y"
        options={Object.keys(this.props.colDtypes)}
        ref={this.inputs.ref("y")}
      ></SingleSelect>,
      <SingleSelect
        key="z"
        label="z"
        options={[""].concat(Object.keys(this.props.colDtypes))}
        ref={this.inputs.ref("z")}
      ></SingleSelect>,
      <SingleSelect
        key="hue"
        label="hue"
        options={[""].concat(Object.keys(this.props.colDtypes))}
        ref={this.inputs.ref("hue")}
      ></SingleSelect>,
    ];
  }

  getPlotParams() {
    var inputValues = {};
    this.inputs.map.forEach((input, name) => {
      inputValues[name] = input.value;
    });
    try {
      return this.scatter(inputValues);
    } catch (error) {
      return {
        name: "error",
        error: error,
      };
    }
  }

  scatter(inputValues) {
    if (inputValues.z != "") {
      return this.scatter3d(inputValues);
    }
    var layout = {};
    var config = {};
    var data = [];
    const { x, y, hue } = inputValues;

    if (hue != "") {
      var hueVal = this.props.df.unique(hue).toArray(hue);
      hueVal.forEach((element) => {
        var trace = {
          type: "scattergl",
          mode: "markers",
          name: element,
        };
        var temp = this.getHue(hue, element);
        trace["x"] = temp.toArray(x);
        trace["y"] = temp.toArray(y);
        data.push(trace);
      });
      layout["legend"] = { title: { text: hue } };
    } else {
      var trace = {
        type: "scattergl",
        mode: "markers",
        x: this.props.df.toArray(x),
        y: this.props.df.toArray(y),
      };
      data.push(trace);
    }

    layout["xaxis"] = { title: x, zeroline: false };
    layout["yaxis"] = { title: y, zeroline: false };

    return {
      name: "plot",
      data: data,
      layout: layout,
      config: config,
    };
  }

  scatter3d(inputValues) {
    var layout = {
      margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
    };
    var config = {};
    var data = [];
    const { x, y, z, hue } = inputValues;

    if (hue != "") {
      var hueVal = this.props.df.unique(hue).toArray(hue);
      hueVal.forEach((element) => {
        var trace = {
          type: "scatter3d",
          mode: "markers",
          name: element,
        };
        var temp = this.getHue(hue, element);
        trace["x"] = temp.toArray(x);
        trace["y"] = temp.toArray(y);
        trace["z"] = temp.toArray(z);
        data.push(trace);
      });
      layout["legend"] = { title: { text: hue } };
    } else {
      var trace = {
        type: "scatter3d",
        mode: "markers",
        x: this.props.df.toArray(x),
        y: this.props.df.toArray(y),
        z: this.props.df.toArray(z),
      };
      data.push(trace);
    }

    layout["scene"] = {
      xaxis: { title: x, zeroline: false },
      yaxis: { title: y, zeroline: false },
      zaxis: { title: z, zeroline: false },
    };

    return {
      name: "plot",
      data: data,
      layout: layout,
      config: config,
    };
  }
}

export class BoxPlot extends PlotComponent {
  constructor(props) {
    super(props);
  }

  get children() {
    return [
      <SingleSelect
        key="x"
        label="x"
        options={[""].concat(Object.keys(this.props.colDtypes))}
        ref={this.inputs.ref("x")}
      ></SingleSelect>,
      <SingleSelect
        key="y"
        label="y"
        options={Object.keys(this.props.colDtypes).filter(
          (column) =>
            this.props.colDtypes[column] == DTypes.INTEGER ||
            this.props.colDtypes[column] == DTypes.FLOAT ||
            this.props.colDtypes[column] == DTypes.DATE
        )}
        ref={this.inputs.ref("y")}
      ></SingleSelect>,
      <SingleSelect
        key="hue"
        label="hue"
        options={[""].concat(Object.keys(this.props.colDtypes))}
        ref={this.inputs.ref("hue")}
      ></SingleSelect>,
      <SingleSelect
        key="orientation"
        label="orientation"
        options={["vertical", "horizontal"]}
        ref={this.inputs.ref("orientation")}
      ></SingleSelect>,
    ];
  }

  getPlotParams() {
    var inputValues = {};
    this.inputs.map.forEach((input, name) => {
      inputValues[name] = input.value;
    });
    try {
      return this.box(inputValues);
    } catch (error) {
      return {
        name: "error",
        error: error,
      };
    }
  }

  box(inputValues) {
    var layout = {};
    var config = {};
    var data = [];
    const { x, y, hue, orientation } = inputValues;
    const orient = orientation[0];

    if (hue != "") {
      var hueVal = this.props.df.unique(hue).toArray(hue);
      hueVal.forEach((element) => {
        var trace = {
          type: "box",
          boxmean: true,
          name: element,
        };
        var temp = this.getHue(hue, element);
        if (x == "") {
          if (orient == Orientation.VERTICAL) trace["y"] = temp.toArray(y);
          else trace["x"] = temp.toArray(y);
        } else {
          if (orient == Orientation.VERTICAL) {
            trace["x"] = temp.toArray(x);
            trace["y"] = temp.toArray(y);
          } else {
            trace["y"] = temp.toArray(x);
            trace["x"] = temp.toArray(y);
          }
          trace["orientation"] = orient;
          layout["boxmode"] = "group";
        }
        data.push(trace);
      });
      layout["legend"] = { title: { text: hue } };
    } else {
      var trace = {
        type: "box",
        name: "",
        boxmean: true,
      };
      if (x == "") {
        if (orient == Orientation.VERTICAL)
          trace["y"] = this.props.df.toArray(y);
        else trace["x"] = this.props.df.toArray(y);
      } else {
        if (orient == Orientation.VERTICAL) {
          trace["x"] = this.props.df.toArray(x);
          trace["y"] = this.props.df.toArray(y);
        } else {
          trace["y"] = this.props.df.toArray(x);
          trace["x"] = this.props.df.toArray(y);
        }
        trace["orientation"] = orient;
      }
      data.push(trace);
    }

    if (orient == Orientation.VERTICAL) {
      layout["xaxis"] = { title: x, zeroline: false };
      layout["yaxis"] = { title: y, zeroline: false };
    } else {
      layout["yaxis"] = { title: x, zeroline: false };
      layout["xaxis"] = { title: y, zeroline: false };
    }

    return {
      name: "plot",
      data: data,
      layout: layout,
      config: config,
    };
  }
}
