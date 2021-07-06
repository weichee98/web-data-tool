import "./InputPanel.css";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs } from "./Tabs";
import { Collapse } from "react-bootstrap";
import CSVParser from "../utils/CSVParser";
import DTypes from "../utils/DataTypes";
import DataFrame from "dataframe-js";

const TIMEOUT = 300;

class CSVTab extends Component {
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
  }

  static get propTypes() {
    return {
      label: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      onLoading: PropTypes.func.isRequired,
      onError: PropTypes.func.isRequired,
    };
  }

  createDataFrame(content) {
    if (content === "") {
      throw new Error("content is empty");
    }
    var arr = CSVParser.csvToArray(content, ",");
    if (arr.length == 1) {
      throw new Error("empty table with header only");
    }
    var columns = [];
    arr[0].forEach((element, i) => {
      if (element !== "") {
        columns.push(element);
      } else {
        columns.push(`undefined::${i}`);
      }
    });
    if (new Set(columns).size !== columns.length) {
      throw new Error("repeated columns found");
    }
    var df = new DataFrame(arr.slice(1, arr.length), columns);
    var col_dtypes = {};
    columns.forEach((c_name) => {
      var dtype = DTypes.checkArrayDtype(df.toArray(c_name));
      col_dtypes[c_name] = dtype;
    });
    return { df: df, col_dtypes: col_dtypes };
  }

  onInputChange(event) {
    const input = event.target;
    if ("files" in input && input.files.length > 0) {
      this.props.onLoading();
      setTimeout(async () => {
        await CSVParser.readFileContent(input.files[0])
          .then((content) => {
            const { df, col_dtypes } = this.createDataFrame(content);
            this.props.onChange(df, col_dtypes);
          })
          .catch((error) => {
            this.props.onError(error);
          });
      }, TIMEOUT);
    }
  }

  render() {
    return (
      <div className="tab-pane" label={this.props.label}>
        <h5 className="card-title">CSV File</h5>
        <p className="card-text">Upload your CSV file.</p>
        <div className="custom-file">
          <label className="btn btn-primary text-center">
            Upload
            <input
              type="file"
              className="custom-file-input"
              style={{ display: "none" }}
              onChange={this.onInputChange}
            ></input>
          </label>
        </div>
      </div>
    );
  }
}

class TSVTab extends Component {
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
  }

  static get propTypes() {
    return {
      label: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      onLoading: PropTypes.func.isRequired,
      onError: PropTypes.func.isRequired,
    };
  }

  createDataFrame(content) {
    if (content === "") {
      throw new Error("content is empty");
    }
    var arr = CSVParser.csvToArray(content, "\t");
    if (arr.length == 1) {
      throw new Error("empty table with header only");
    }
    var columns = [];
    arr[0].forEach((element, i) => {
      if (element !== "") {
        columns.push(element);
      } else {
        columns.push(`undefined::${i}`);
      }
    });
    if (new Set(columns).size !== columns.length) {
      throw new Error("repeated columns found");
    }
    var df = new DataFrame(arr.slice(1, arr.length), columns);
    var col_dtypes = {};
    columns.forEach((c_name) => {
      var dtype = DTypes.checkArrayDtype(df.toArray(c_name));
      col_dtypes[c_name] = dtype;
    });
    return { df: df, col_dtypes: col_dtypes };
  }

  onInputChange(event) {
    const input = event.target;
    if ("files" in input && input.files.length > 0) {
      this.props.onLoading();
      setTimeout(async () => {
        await CSVParser.readFileContent(input.files[0])
          .then((content) => {
            const { df, col_dtypes } = this.createDataFrame(content);
            this.props.onChange(df, col_dtypes);
          })
          .catch((error) => {
            this.props.onError(error);
          });
      }, TIMEOUT);
    }
  }

  render() {
    return (
      <div className="tab-pane" label={this.props.label}>
        <h5 className="card-title">TSV File</h5>
        <p className="card-text">Upload your TSV file.</p>
        <div className="custom-file">
          <label className="btn btn-primary text-center">
            Upload
            <input
              type="file"
              className="custom-file-input"
              style={{ display: "none" }}
              onChange={this.onInputChange}
            ></input>
          </label>
        </div>
      </div>
    );
  }
}

class InputPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputLoading = this.onInputLoading.bind(this);
  }

  static get propTypes() {
    return {
      onLoading: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired,
      onError: PropTypes.func.isRequired,
    };
  }

  onInputLoading() {
    this.setState({ open: false });
    this.props.onLoading();
  }

  onInputChange(df, col_dtypes) {
    this.props.onChange(df, col_dtypes);
  }

  render() {
    return (
      <div>
        <nav
          className="navbar navbar-light bg-light"
          style={{ padding: ".5rem" }}
        >
          <a
            className="input-navbar-toggle nav-link import-btn"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              this.setState({ open: !this.state.open });
            }}
          >
            <span
              className="navbar-toggler-icon"
              style={{ zoom: "70%", marginRight: "1rem" }}
            ></span>
            Import Data
          </a>
        </nav>
        <Collapse in={this.state.open}>
          <div className="navbar-collapse bg-light input-panel-tabs">
            <Tabs>
              <CSVTab
                label="CSV"
                onLoading={this.onInputLoading}
                onError={this.props.onError}
                onChange={this.onInputChange}
              ></CSVTab>
              <TSVTab
                label="TSV"
                onLoading={this.onInputLoading}
                onError={this.props.onError}
                onChange={this.onInputChange}
              ></TSVTab>
            </Tabs>
          </div>
        </Collapse>
      </div>
    );
  }
}

export default InputPanel;
