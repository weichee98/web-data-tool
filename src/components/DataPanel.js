import "./DataPanel.css";
import React, { Component } from "react";
import PropTypes from "prop-types";
import DataFrame from "dataframe-js";

class TablePageNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      currentPage: 0,
      maxPage: 0,
      numEntries: 0,
      rowPerPage: 0,
    };
    this.onSliderRelease = this.onSliderRelease.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.onPreviousClick = this.onPreviousClick.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
  }

  static get propTypes() {
    return {
      onChange: PropTypes.func,
      height: PropTypes.string,
    };
  }

  resetState() {
    this.setState({
      value: 0,
      currentPage: 0,
      maxPage: 0,
      numEntries: 0,
      rowPerPage: 0,
    });
  }

  updateState(numEntries, rowPerPage) {
    this.setState({
      value: 1,
      currentPage: 1,
      numEntries: numEntries,
      rowPerPage: rowPerPage,
      maxPage: Math.ceil(numEntries / rowPerPage),
    });
  }

  getDescription() {
    if (this.state.numEntries == 0) {
      return "Showing 0 entries";
    } else {
      var start = (this.state.currentPage - 1) * this.state.rowPerPage + 1;
      var end = Math.min(
        start + this.state.rowPerPage - 1,
        this.state.numEntries
      );
      return `Showing ${start} to ${end} of ${this.state.numEntries} entries`;
    }
  }

  callOnChange() {
    if (this.props.onChange == null) {
      return;
    }
    this.props.onChange(this);
  }

  onSliderRelease(event) {
    var newPage = parseInt(event.target.value, 10);
    this.setState({
      currentPage: newPage,
      value: newPage,
    });
    this.callOnChange();
  }

  onSliderChange(event) {
    this.setState({
      currentPage: parseInt(event.target.value, 10),
    });
  }

  onPreviousClick() {
    var newPage = Math.max(
      Math.min(this.state.maxPage, 1),
      this.state.currentPage - 1
    );
    this.setState({
      value: newPage,
      currentPage: newPage,
    });
    this.callOnChange();
  }

  onNextClick() {
    var newPage = Math.min(this.state.maxPage, this.state.currentPage + 1);
    this.setState({
      value: newPage,
      currentPage: newPage,
    });
    this.callOnChange();
  }

  render() {
    return (
      <div
        className="table-page-navigator"
        style={{
          paddingTop: "1rem",
          height: this.props.height,
        }}
      >
        <label className="page-description">{this.getDescription()}</label>
        <div className="table-page-navigator">
          <input
            type="range"
            className="form-range page-slider"
            min={Math.min(this.state.maxPage, 1)}
            max={this.state.maxPage}
            step="1"
            value={this.state.currentPage}
            onChange={this.onSliderChange}
            onMouseUp={this.onSliderRelease}
          ></input>
          <div style={{ whiteSpace: "nowrap" }}>
            <button className="btn page-item" onClick={this.onPreviousClick}>
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only"></span>
              </a>
            </button>
            <label className="page-label">{this.state.currentPage}</label>
            <button className="btn page-item" onClick={this.onNextClick}>
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only"></span>
              </a>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class DataPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      df: new DataFrame([]),
      name: "noMessage",
      currentPage: 0,
      rowPerPage: 0,
      error: null,
    };
    this.navigator = React.createRef();
    this.onPageChange = this.onPageChange.bind(this);
    this.maxCell = 600;
  }

  static get propTypes() {
    return {
      panelHeight: PropTypes.string,
      navigatorHeight: PropTypes.string,
    };
  }

  onPageChange(navigator) {
    if (navigator.state.currentPage == 0) {
      this.setState({ name: "noMessage" });
    }
    this.setState({
      name: "table",
      currentPage: navigator.state.currentPage,
    });
  }

  setDataFrame(df) {
    if (df.count() == 0) {
      this.setError(new Error("Data provided is empty"));
      return;
    }
    var max_row = this.maxCell / df.listColumns().length;
    var rowPerPage;
    if (max_row >= 200) {
      rowPerPage = 200;
    } else if (max_row >= 100) {
      rowPerPage = 100;
    } else if (max_row >= 50) {
      rowPerPage = 50;
    } else {
      rowPerPage = 20;
    }
    this.setState({
      df: df,
      name: "table",
      currentPage: 1,
      rowPerPage: rowPerPage,
    });
    var numEntries = this.state.df.count();
    this.navigator.updateState(numEntries, rowPerPage);
  }

  setError(error) {
    this.setState({
      df: new DataFrame([]),
      name: "error",
      currentPage: 0,
      rowPerPage: 0,
      error: error,
    });
    this.navigator.resetState();
  }

  setLoading() {
    this.setState({ name: "loading" });
  }

  renderTable() {
    return (
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            {this.state.df.listColumns().map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {() => {
            var length = this.state.df.count();
            var rowPerPage = this.navigator.state.rowPerPage;
            var page = this.state.currentPage;
            var start = (page - 1) * rowPerPage;
            var end = Math.min(page * rowPerPage, length);
            var rows = [];
            for (var i = start; i < end; i++) {
              rows.push(
                <tr key={i}>
                  {this.state.df
                    .getRow(i)
                    .toArray()
                    .map((col, j) => (
                      <td key={j}>{col}</td>
                    ))}
                </tr>
              );
            }
            return rows;
          }}
        </tbody>
      </table>
    );
  }

  renderDataPanel() {
    switch (this.state.name) {
      case "loading":
        return (
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        );
      case "noMessage":
        return <h5>No data to display</h5>;
      case "table":
        return this.renderTable();
      case "error":
        return <h5>{this.state.error.toString()}</h5>;
    }
  }

  render() {
    return (
      <div>
        <TablePageNavigator
          onChange={this.onPageChange}
          ref={this.navigator}
          style={{ height: this.props.navigatorHeight || "auto" }}
        ></TablePageNavigator>
        <div
          className="card-body"
          style={{ height: this.props.panelHeight || "auto" }}
        >
          <div className="card text-center bg-light data-sub-container">
            <div className="data-panel">{this.renderDataPanel()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default DataPanel;
