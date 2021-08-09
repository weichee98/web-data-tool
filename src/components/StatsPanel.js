import "./StatsPanel.css";
import React, { Component } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import PropTypes from "prop-types";
import DataFrame from "dataframe-js";
import Plot from "react-plotly.js";
import DTypes from "../utils/DataTypes";
import Spinner from "./Spinner";

const TIMEOUT = 100;

class StatsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      df: new DataFrame([]),
      col_dtypes: [],
      name: "noMessage",
      error: null,
      column: null,
    };
  }

  static get propTypes() {
    return {
      panelHeight: PropTypes.string,
      menuHeight: PropTypes.string,
    };
  }

  setDataFrame(df, col_dtypes) {
    this.setState({
      df: df,
      col_dtypes: col_dtypes,
      name: "noMessage",
    });
  }

  setError(error) {
    this.setState({
      name: "error",
      error: error,
    });
  }

  setLoading() {
    this.setState({ name: "loading" });
  }

  logErrorToConsole(func) {
    try {
      func();
    } catch (error) {
      console.error(error.toString());
    }
  }

  static roundNumber(num, dp = 5, sci = 6) {
    var exp = Math.max(0, Math.floor(Math.log10(num)));
    if (exp < sci) {
      return num.toFixed(dp - exp);
    }
    return num.toExponential(dp);
  }

  noDataToDisplay() {
    var shape = this.state.df.dim();
    if (shape[0] == 0 || shape[1] == 0) {
      this.setState({ name: "noMessage" });
      return true;
    }
    return false;
  }

  renderColumnStatistic() {
    if (this.noDataToDisplay()) return;
    try {
      var col_name = this.state.column;
      var series = this.state.df.select(col_name);
      var dtype = this.state.col_dtypes[col_name];
      var children = [];

      children.push(
        <div key="title">
          <h5 style={{ marginTop: "30px" }}>{col_name}</h5>
        </div>
      );

      // value counts
      this.logErrorToConsole(() => {
        var map = series
          .toArray(col_name)
          .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
        var x = Array.from(map.keys());
        var y = Array.from(map.values());
        var layout = {
          height: 260,
          margin: { t: 20, b: 30 },
          paper_bgcolor: "rgba(0, 0, 0, 0)",
          plot_bgcolor: "rgba(0, 0, 0, 0)",
        };
        var data;
        if (dtype == DTypes.STRING || dtype == DTypes.BOOLEAN) {
          data = [
            {
              values: y,
              labels: x,
              type: "pie",
              textposition: "inside",
              textinfo: "label",
            },
          ];
          layout["showlegend"] = false;
        } else {
          data = [{ x: series.toArray(col_name), type: "histogram" }];
        }
        children.push(
          <Plot
            key="plot"
            data={data}
            layout={layout}
            useResizeHandler={true}
            style={{ width: "100%" }}
          ></Plot>
        );
      });

      var statsTable = [];

      // dtypes, count, nunique
      this.logErrorToConsole(() => {
        var nunique;
        if (dtype == DTypes.DATE) {
          nunique = series.cast(col_name, String).distinct(col_name).count();
        } else {
          nunique = series.distinct(col_name).count();
        }
        var count = series.dropMissingValues().count();
        var length = series.count();
        var percentage = (count / length) * 100;
        statsTable.push({
          name: "Data type",
          value: dtype,
        });
        statsTable.push({
          name: "Number of unique values",
          value: nunique,
        });
        statsTable.push({
          name: "Number of valid values",
          value: `${count} (${percentage.toFixed(2)}%)`,
        });
      });

      if (dtype == DTypes.INTEGER || dtype == DTypes.FLOAT) {
        series = series.dropMissingValues([col_name]).sortBy(col_name);

        // min max
        this.logErrorToConsole(() => {
          var min = series.stat.min(col_name);
          var max = series.stat.max(col_name);
          min = StatsPanel.roundNumber(min);
          max = StatsPanel.roundNumber(max);
          statsTable.push({
            name: "Minimum",
            value: min,
          });
          statsTable.push({
            name: "Maximum",
            value: max,
          });
        });

        // mean
        this.logErrorToConsole(() => {
          var mean = series.stat.mean(col_name);
          mean = StatsPanel.roundNumber(mean);
          statsTable.push({
            name: "Mean",
            value: mean,
          });
        });

        // median
        this.logErrorToConsole(() => {
          var half = Math.floor(series.count() / 2);
          var median;
          if (series.count() % 2) median = series.getRow(half).get(col_name);
          else
            median =
              (series.getRow(half - 1).get(col_name) +
                series.getRow(half).get(col_name)) /
              2.0;
          median = StatsPanel.roundNumber(median);
          statsTable.push({
            name: "Median",
            value: median,
          });
        });

        // std variance
        this.logErrorToConsole(() => {
          var variance = series.stat.var(col_name);
          var std = Math.sqrt(variance);
          variance = StatsPanel.roundNumber(variance);
          std = StatsPanel.roundNumber(std);
          statsTable.push({
            name: "Standard deviation",
            value: std,
          });
          statsTable.push({
            name: "Variance",
            value: variance,
          });
        });
      }

      if (statsTable.length > 0) {
        children.push(
          <div key="table" className="card-body">
            <table
              className="table stats-description"
              style={{ textAlign: "left" }}
            >
              {statsTable.map(({ name, value }, i) => (
                <tr key={i}>
                  <th>{name.toString()}</th>
                  <td>{value.toString()}</td>
                </tr>
              ))}
            </table>
          </div>
        );
      }

      return children;
    } catch (error) {
      return <h5>{this.state.error.toString()}</h5>;
    }
  }

  renderStatsPanel() {
    switch (this.state.name) {
      case "loading":
        return <Spinner></Spinner>;
      case "noMessage":
        return <h5>No data to display</h5>;
      case "stats":
        return this.renderColumnStatistic();
      case "error":
        return <h5>{this.state.error.toString()}</h5>;
    }
  }

  render() {
    return (
      <div>
        <Navbar expand="lg" style={{ height: this.props.menuHeight || "auto" }}>
          <Navbar.Toggle></Navbar.Toggle>
          <Navbar.Collapse>
            <Nav>
              <NavDropdown
                title="Columns Exploration"
                className="link"
                href="#"
                style={{ color: "#0d6efd" }}
              >
                {this.state.df.listColumns().map((col, i) => (
                  <NavDropdown.Item
                    key={i}
                    onClick={(event) => {
                      event.preventDefault();
                      this.setLoading();
                      setTimeout(() => {
                        this.setState({
                          name: "stats",
                          column: col,
                        });
                      }, TIMEOUT);
                    }}
                  >
                    {col}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div
          className="container"
          style={{ height: this.props.panelHeight || "auto" }}
        >
          <div className="card text-center bg-light stats-sub-container">
            <div className="stats-panel">{this.renderStatsPanel()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default StatsPanel;
