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

  /**
   * name: "error", "plot"
   * data: []
   * layout: {}
   * config: {}
   * error: Error
   */
  getPlotParams() {
    var inputValues = {};
    this.inputs.map.forEach((input, name) => {
      inputValues[name] = input.value;
    });
    try {
      return this.processPlotParams(inputValues);
    } catch (error) {
      return {
        name: "error",
        error: error,
      };
    }
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
    this.processPlotParams = this.line.bind(this);
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

  line(inputValues) {
    var layout = {};
    var config = {};
    var data = [];
    const { x, y, hue } = inputValues;

    if (y.length == 0) {
      throw new Error("y not selected");
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
        throw new Error("y must have only 1 column when hue is selected");
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
    this.processPlotParams = this.scatter.bind(this);
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
    this.processPlotParams = this.box.bind(this);
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

export class Heatmap extends PlotComponent {
  constructor(props) {
    super(props);
    this.processPlotParams = this.heatmap.bind(this);
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
        options={[""].concat(Object.keys(this.props.colDtypes))}
        ref={this.inputs.ref("y")}
      ></SingleSelect>,
      <SingleSelect
        key="aggcol"
        label="aggcol"
        options={Object.keys(this.props.colDtypes).filter(
          (column) =>
            this.props.colDtypes[column] == DTypes.INTEGER ||
            this.props.colDtypes[column] == DTypes.FLOAT
        )}
        ref={this.inputs.ref("aggcol")}
      ></SingleSelect>,
      <SingleSelect
        key="agg"
        label="agg"
        options={[
          "count",
          "average",
          "minimum",
          "maximum",
          "standard deviation",
          "variance",
          "sum",
        ]}
        ref={this.inputs.ref("agg")}
      ></SingleSelect>,
      <SingleSelect
        key="color"
        label="color"
        options={[
          "Reds",
          "Blues",
          "Greens",
          "Greys",
          "YlOrRd",
          "YlGnBu",
          "RdBu",
          "Bluered",
          "Portland",
          "Rainbow",
          "Picnic",
          "Jet",
          "Hot",
          "Electric",
          "Earth",
          "Blackbody",
          "Viridis",
          "Cividis",
        ]}
        ref={this.inputs.ref("color")}
      ></SingleSelect>,
      <SingleSelect
        key="reversescale"
        label="reversescale"
        options={["false", "true"]}
        ref={this.inputs.ref("reversescale")}
      ></SingleSelect>,
    ];
  }

  createEmptyGrid(nrow, ncol) {
    var grid = [];
    for (var r = 0; r < nrow; r++) {
      grid.push([]);
      for (var c = 0; c < ncol; c++) {
        grid[r].push(NaN);
      }
    }
    return grid;
  }

  getGroupAgg(group, col_name, agg) {
    try {
      group = group.dropMissingValues([col_name]);
      switch (agg) {
        case "count":
          return group.count();
        case "average":
          return group.stat.mean(col_name);
        case "minimum":
          return group.stat.min(col_name);
        case "maximum":
          return group.stat.max(col_name);
        case "standard deviation":
          return group.stat.sd(col_name);
        case "variance":
          return group.stat.var(col_name);
        case "sum":
          return group.stat.sum(col_name);
        default:
          return NaN;
      }
    } catch (error) {
      return NaN;
    }
  }

  getTrace(col_name, agg, x, y, color, reversescale) {
    var groupby;
    if (x == "") {
      groupby = this.props.df.groupBy(y);
    } else if (y == "") {
      groupby = this.props.df.groupBy(x);
    } else {
      groupby = this.props.df.groupBy(x, y);
    }

    var temp = groupby.aggregate((group) =>
      this.getGroupAgg(group, col_name, agg)
    );
    var trace = {};
    var agg_col = "aggregation";
    if (y == "") {
      temp = temp.sortBy(x);
      trace["y"] = [""];
      trace["x"] = temp.toArray(x);
      trace["z"] = [temp.toArray(agg_col)];
    } else if (x == "") {
      temp = temp.sortBy(y);
      trace["x"] = [""];
      trace["y"] = temp.toArray(y);
      trace["z"] = temp.select(agg_col).toArray();
    } else {
      temp = temp.sortBy([x, y]);
      trace["x"] = temp.unique(x).toArray(x);
      trace["y"] = temp.unique(y).toArray(y);
      trace["z"] = this.createEmptyGrid(trace["y"].length, trace["x"].length);
      var xmap = Object.fromEntries(trace["x"].map((x, i) => [x, i]));
      var ymap = Object.fromEntries(trace["y"].map((x, i) => [x, i]));
      for (var i = 0; i < temp.count(); i++) {
        var row = temp.getRow(i);
        var xname = row.get(x);
        var yname = row.get(y);
        trace["z"][ymap[yname]][xmap[xname]] = row.get(agg_col);
      }
    }

    trace["colorscale"] = color;
    trace["reversescale"] = reversescale;
    trace["type"] = "heatmap";
    return trace;
  }

  heatmap(inputValues) {
    var layout = {};
    var config = {};
    var data = [];
    var { x, y, agg, aggcol, color, reversescale } = inputValues;
    reversescale = DTypes.evalValue(reversescale);

    if (x === "" && y === "") {
      throw new Error("No x or y provided");
    }

    if (agg !== "count" && (x === aggcol || y === aggcol)) {
      throw new Error("Column for agg cannot be the same as x or y");
    }

    data.push(this.getTrace(aggcol, agg, x, y, color, reversescale));
    layout["xaxis"] = { title: x, zeroline: false };
    layout["yaxis"] = { title: y, zeroline: false };

    return {
      name: "plot",
      data: data,
      layout: layout,
      config: config,
    };
  }
}

export class Histogram extends PlotComponent {
  constructor(props) {
    super(props);
    this.processPlotParams = this.histogram.bind(this);
  }

  get children() {
    return [
      <MultiSelect
        key="column"
        label="column"
        options={Object.keys(this.props.colDtypes).filter(
          (column) =>
            this.props.colDtypes[column] == DTypes.INTEGER ||
            this.props.colDtypes[column] == DTypes.FLOAT ||
            this.props.colDtypes[column] == DTypes.DATE
        )}
        ref={this.inputs.ref("column")}
      ></MultiSelect>,
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
      <SingleSelect
        key="barmode"
        label="barmode"
        options={["overlay", "stack"]}
        ref={this.inputs.ref("barmode")}
      ></SingleSelect>,
      <SingleSelect
        key="histnorm"
        label="histnorm"
        options={[
          "count",
          "percent",
          "probability",
          "density",
          "probability density",
        ]}
        ref={this.inputs.ref("histnorm")}
      ></SingleSelect>,
      <SingleSelect
        key="cumulative"
        label="cumulative"
        options={["false", "true"]}
        ref={this.inputs.ref("cumulative")}
      ></SingleSelect>,
    ];
  }

  histogram(inputValues) {
    var layout = {};
    var config = {};
    var data = [];
    var { column, hue, orientation, cumulative, histnorm, barmode } =
      inputValues;
    orientation = orientation[0];
    histnorm = histnorm === "count" ? "" : histnorm;
    cumulative = DTypes.evalValue(cumulative);

    if (column.length === 0) {
      throw new Error("No column selected");
    }

    if (column.length === 1) {
      if (hue === "") {
        var trace = {
          type: "histogram",
          showlegend: false,
          cumulative: { enabled: cumulative },
          histnorm: histnorm,
        };
        if (orientation === Orientation.VERTICAL) {
          trace["x"] = this.props.df.toArray(column[0]);
        } else {
          trace["y"] = this.props.df.toArray(column[0]);
        }
        data.push(trace);
      } else {
        var hueVal = this.props.df.unique(hue).toArray(hue);
        hueVal.forEach((element) => {
          var trace = {
            type: "histogram",
            cumulative: { enabled: cumulative },
            histnorm: histnorm,
            name: element,
          };
          var temp = this.getHue(hue, element);
          if (orientation === Orientation.VERTICAL) {
            trace["x"] = temp.toArray(column[0]);
          } else {
            trace["y"] = temp.toArray(column[0]);
          }
          if (barmode === "overlay") {
            trace["opacity"] = 0.5;
          }
          data.push(trace);
        });
        layout["legend"] = { title: { text: hue } };
      }
      if (orientation === Orientation.VERTICAL) {
        layout["xaxis"] = { title: column[0], zeroline: false };
        layout["yaxis"] = {
          title: histnorm === "" ? "count" : histnorm,
          zeroline: false,
        };
      } else {
        layout["yaxis"] = { title: column[0], zeroline: false };
        layout["xaxis"] = {
          title: histnorm === "" ? "count" : histnorm,
          zeroline: false,
        };
      }
    } else {
      if (hue != "") {
        throw Error("y must have only 1 column when hue is selected");
      }
      column.forEach((c_name) => {
        var trace = {
          name: c_name,
          type: "histogram",
          cumulative: { enabled: cumulative },
          histnorm: histnorm,
        };
        if (orientation === Orientation.VERTICAL) {
          trace["x"] = this.props.df.toArray(c_name);
        } else {
          trace["y"] = this.props.df.toArray(c_name);
        }
        if (barmode === "overlay") {
          trace["opacity"] = 0.5;
        }
        data.push(trace);
      });
      if (orientation === Orientation.VERTICAL) {
        layout["yaxis"] = {
          title: histnorm == "" ? "count" : histnorm,
          zeroline: false,
        };
      } else {
        layout["xaxis"] = {
          title: histnorm == "" ? "count" : histnorm,
          zeroline: false,
        };
      }
    }

    layout["barmode"] = barmode;

    return {
      name: "plot",
      data: data,
      layout: layout,
      config: config,
    };
  }
}

export class BarChart extends PlotComponent {
  constructor(props) {
    super(props);
    this.processPlotParams = this.bar.bind(this);
  }

  get children() {
    return [
      <SingleSelect
        key="x"
        label="x"
        options={Object.keys(this.props.colDtypes)}
        ref={this.inputs.ref("x")}
      ></SingleSelect>,
      <MultiSelect
        key="y"
        label="y"
        options={Object.keys(this.props.colDtypes).filter(
          (column) =>
            this.props.colDtypes[column] == DTypes.INTEGER ||
            this.props.colDtypes[column] == DTypes.FLOAT
        )}
        ref={this.inputs.ref("y")}
      ></MultiSelect>,
      <SingleSelect
        key="hue"
        label="hue"
        options={[""].concat(Object.keys(this.props.colDtypes))}
        ref={this.inputs.ref("hue")}
      ></SingleSelect>,
      <SingleSelect
        key="agg"
        label="agg"
        options={[
          "count",
          "average",
          "minimum",
          "maximum",
          "standard deviation",
          "variance",
          "sum",
        ]}
        ref={this.inputs.ref("agg")}
      ></SingleSelect>,
      <SingleSelect
        key="orientation"
        label="orientation"
        options={["vertical", "horizontal"]}
        ref={this.inputs.ref("orientation")}
      ></SingleSelect>,
      <SingleSelect
        key="barmode"
        label="barmode"
        options={["group", "stack"]}
        ref={this.inputs.ref("barmode")}
      ></SingleSelect>,
    ];
  }

  getGroupAgg(df, x, y, agg) {
    var groupby = df.groupBy(x);
    groupby = groupby.aggregate((group) => {
      try {
        group = group.dropMissingValues([y]);
        switch (agg) {
          case "count":
            return group.count();
          case "average":
            return group.stat.mean(y);
          case "minimum":
            return group.stat.min(y);
          case "maximum":
            return group.stat.max(y);
          case "standard deviation":
            return group.stat.sd(y);
          case "variance":
            return group.stat.var(y);
          case "sum":
            return group.stat.sum(y);
          default:
            return NaN;
        }
      } catch (error) {
        return NaN;
      }
    });
    return groupby.rename("aggregation", y);
  }

  bar(inputValues) {
    var layout = {};
    var config = {};
    var data = [];
    var { x, y, hue, agg, orientation, barmode } = inputValues;
    orientation = orientation[0];

    if (y.length === 0) {
      throw new Error("No column selected");
    }

    if (y.length === 1) {
      if (hue === "") {
        var trace = {
          type: "bar",
          orientation: orientation,
        };
        var temp = this.getGroupAgg(this.props.df, x, y[0], agg);
        if (orientation === Orientation.VERTICAL) {
          trace["x"] = temp.toArray(x);
          trace["y"] = temp.toArray(y[0]);
        } else {
          trace["y"] = temp.toArray(x);
          trace["x"] = temp.toArray(y[0]);
        }
        data.push(trace);
      } else {
        var hueVal = this.props.df.unique(hue).toArray(hue);
        hueVal.forEach((element) => {
          var trace = {
            type: "bar",
            orientation: orientation,
            name: element,
          };
          var temp = this.getHue(hue, element);
          temp = this.getGroupAgg(temp, x, y[0], agg);
          if (orientation === Orientation.VERTICAL) {
            trace["x"] = temp.toArray(x);
            trace["y"] = temp.toArray(y[0]);
          } else {
            trace["y"] = temp.toArray(x);
            trace["x"] = temp.toArray(y[0]);
          }
          data.push(trace);
        });
        layout["legend"] = { title: { text: hue } };
      }
      if (orientation === Orientation.VERTICAL) {
        layout["xaxis"] = { title: x, zeroline: false };
        layout["yaxis"] = { title: y[0], zeroline: false };
      } else {
        layout["yaxis"] = { title: x, zeroline: false };
        layout["xaxis"] = { title: y[0], zeroline: false };
      }
    } else {
      if (hue != "") {
        throw Error("y must have only 1 column when hue is selected");
      }
      y.forEach((c_name) => {
        var trace = {
          name: c_name,
          type: "bar",
          orientation: orientation,
        };
        var temp = this.getGroupAgg(this.props.df, x, c_name, agg);
        if (orientation === Orientation.VERTICAL) {
          trace["x"] = temp.toArray(x);
          trace["y"] = temp.toArray(c_name);
        } else {
          trace["y"] = temp.toArray(x);
          trace["x"] = temp.toArray(c_name);
        }
        data.push(trace);
      });
      if (orientation === Orientation.VERTICAL) {
        layout["xaxis"] = { title: x, zeroline: false };
      } else {
        layout["yaxis"] = { title: x, zeroline: false };
      }
    }

    layout["barmode"] = barmode;

    return {
      name: "plot",
      data: data,
      layout: layout,
      config: config,
    };
  }
}
