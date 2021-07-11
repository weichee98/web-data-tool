import "./ProcessPanel.css";
import React, { Component } from "react";
import { DataFrame } from "dataframe-js";
import PropTypes from "prop-types";
import AceEditor from "react-ace";
import DTypes from "../utils/DataTypes";

import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-sqlserver";
import "ace-builds/src-noconflict/ext-language_tools";

const TIMEOUT = 300;

class ProcessPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      df: new DataFrame([]),
      colDtypes: {},
      viewList: new Map(),
      activeView: null,
      activeViewName: null,
      displayViewName: "",
      displaySQL: "",
      messageType: "message",
      error: null,
      success: null,
    };
    DataFrame.sql.dropTables();
    DataFrame.sql.registerTable(this.state.df, "df");
    this.dataPanel = React.createRef();
    this.statsPanel = React.createRef();
    this.id = 0;
  }

  static get propTypes() {
    return {
      height: PropTypes.string,
      onLoading: PropTypes.func.isRequired,
      onRender: PropTypes.func.isRequired,
      onRenderError: PropTypes.func.isRequired,
    };
  }

  get buttons() {
    return [
      { name: "New", onClick: this.newView },
      { name: "Save", onClick: this.saveView },
      { name: "Delete", onClick: this.deleteView },
      { name: "Download CSV", onClick: this.downloadCSV },
      { name: "Download SQL", onClick: this.downloadSQL },
      { name: "Download Views", onClick: this.downloadViews },
      { name: "Render", onClick: this.renderDataPanel },
    ];
  }

  reset() {
    this.id = 0;
    this.setState({
      viewList: new Map(),
      activeView: null,
      activeViewName: null,
      displayViewName: "",
      displaySQL: "",
      messageType: "message",
      error: null,
      success: null,
    });
  }

  setDataFrame(df, colDtypes) {
    this.setState({
      df: df,
      colDtypes: colDtypes,
    });
    this.reset();
    DataFrame.sql.dropTables();
    DataFrame.sql.registerTable(df, "df");
  }

  noMessageAlert() {
    this.setState({ messageType: "message" });
  }

  errorAlert(error) {
    this.setState({ messageType: "error", error: error });
  }

  successAlert(message) {
    this.setState({ messageType: "success", success: message });
  }

  newView = (event) => {
    event.preventDefault();
    var tables = DataFrame.sql.listTables();
    if (tables.length == 0) {
      this.errorAlert(new Error("Data panel is empty"));
      return;
    }
    var id = this.id;
    do {
      var new_name = `tbl${++id}`;
    } while (new_name in tables);
    this.state.viewList.set(id, { name: new_name, sql: "SELECT * FROM df" });
    DataFrame.sql.registerTable(
      DataFrame.sql.request("SELECT * FROM df"),
      new_name
    );
    this.setState({
      activeView: id,
      activeViewName: new_name,
      displayViewName: this.getDisplayViewName(new_name),
      displaySQL: this.getDisplaySQL(id),
    });
    this.id++;
  };

  saveView = (event) => {
    event.preventDefault();
    if (this.state.activeView == null || this.state.activeViewName == "df") {
      this.errorAlert(new Error("No view selected"));
      return;
    }

    var id = this.state.activeView;
    var cur_name = this.state.activeViewName;
    var new_name = this.state.displayViewName;
    if (new_name !== cur_name && new_name in DataFrame.sql.listTables()) {
      this.errorAlert(new Error(`Table ${new_name} already exists`));
    }

    try {
      var sql = this.state.displaySQL;
      var formatted_sql = sql.replace(/\s+/g, " ");
      var new_df = DataFrame.sql.request(formatted_sql);
      if (new_name == cur_name) {
        DataFrame.sql.registerTable(new_df, new_name, true);
      } else {
        DataFrame.sql.registerTable(new_df, new_name);
        DataFrame.sql.dropTable(cur_name);
      }
      this.state.viewList.set(id, { name: new_name, sql: sql });
      this.setState({
        activeView: id,
        activeViewName: new_name,
        displayViewName: this.getDisplayViewName(new_name),
        displaySQL: this.getDisplaySQL(id),
      });
      this.successAlert(`View ${new_name} successfully saved`);
    } catch (error) {
      this.errorAlert(error);
    }
  };

  deleteView = (event) => {
    event.preventDefault();
    if (this.state.activeView == null || this.state.activeViewName == "df") {
      this.errorAlert(new Error("No view selected"));
      return;
    }

    try {
      DataFrame.sql.dropTable(this.state.activeViewName);
      this.state.viewList.delete(this.state.activeView);
      this.setState({
        activeView: null,
        activeViewName: null,
        displayViewName: "",
        displaySQL: "",
      });
    } catch (error) {
      this.errorAlert(error);
    }
  };

  renderDataPanel = (event) => {
    event.preventDefault();
    if (this.state.activeView == null) {
      this.errorAlert(new Error("No view selected"));
      this.props.onRenderError(new Error("No view selected"));
      return;
    }
    try {
      this.props.onLoading();
      setTimeout(() => {
        var df = DataFrame.sql.request(
          `SELECT * FROM ${this.state.activeViewName}`
        );
        var colDtypes = {};
        df.listColumns().forEach((c_name) => {
          var dtype = DTypes.checkArrayDtype(df.toArray(c_name));
          colDtypes[c_name] = dtype;
        });
        this.props.onRender(df, colDtypes);
        this.successAlert(
          `View ${this.state.activeViewName} successfully rendered`
        );
      }, TIMEOUT);
    } catch (error) {
      this.errorAlert(error);
      this.props.onRenderError(error);
    }
  };

  renderViewList() {
    var viewList = [];
    this.state.viewList.forEach((view, id) => {
      if (view.name == "df" || view.name == null) {
        return;
      }
      var className = "list-group-item list-group-item-action";
      if (id == this.state.activeView) {
        className += " active";
      }
      viewList.push(
        <button
          key={id}
          name={view.name}
          value={id}
          className={className}
          onClick={(event) => {
            event.preventDefault();
            this.setState({
              activeView: parseInt(event.target.value, 10),
              activeViewName: event.target.name,
              displayViewName: this.getDisplayViewName(event.target.name),
              displaySQL: this.getDisplaySQL(parseInt(event.target.value, 10)),
            });
          }}
        >
          {view.name}
        </button>
      );
    });
    return viewList;
  }

  getDisplayViewName(activeViewName) {
    return activeViewName == null || activeViewName == "df"
      ? ""
      : activeViewName;
  }

  getDisplaySQL(activeView) {
    var name = this.state.viewList.get(activeView).name;
    return name == null || name == "df"
      ? ""
      : this.state.viewList.get(activeView).sql;
  }

  renderMessage() {
    switch (this.state.messageType) {
      case "success":
        return (
          <div className="alert alert-success status-description" role="alert">
            {this.state.success}
          </div>
        );
      case "error":
        return (
          <div className="alert alert-danger status-description" role="alert">
            {this.state.error.toString()}
          </div>
        );
      default:
        return (
          <div className="alert alert-primary status-description" role="alert">
            No message to display
          </div>
        );
    }
  }

  render() {
    return (
      <div>
        <div className="text-center bg-light" style={{ padding: "1rem" }}>
          <ul className="nav button-nav" style={{ justifyContent: "flex-end" }}>
            {this.buttons.map(({ name, onClick }, i) => (
              <li key={i} className="nav-item">
                <a className="nav-link" onClick={onClick} type="button">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="process-main-container"
          style={{ height: this.props.height || "auto" }}
        >
          <div style={{ flex: 2 }}>
            <div className="card-body" style={{ height: "100%" }}>
              <div
                className="card bg-light view-list-container"
                style={{ overflow: "auto" }}
              >
                <button
                  className="btn btn-outline-primary text-center view-list-title"
                  disabled
                >
                  View List
                </button>
                <div className="list-group">
                  <button className="list-group-item list-group-item-action disabled">
                    df
                  </button>
                  {this.renderViewList()}
                </div>
              </div>
            </div>
          </div>
          <div className="card-body process-input-panel" style={{ flex: 5 }}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">View Name</span>
              </div>
              <input
                type="text"
                className="form-control"
                value={this.state.displayViewName}
                onChange={(event) => {
                  this.setState({ displayViewName: event.target.value });
                  this.noMessageAlert();
                }}
                disabled={
                  this.state.activeViewName == null ||
                  this.state.activeViewName == "df"
                }
              ></input>
            </div>
            <div className="input-group mb-3" style={{ height: "100%" }}>
              <div className="input-group-prepend">
                <span className="input-group-text">SQL</span>
              </div>
              <AceEditor
                mode="mysql"
                theme="sqlserver"
                value={this.state.displaySQL}
                readOnly={
                  this.state.activeViewName == null ||
                  this.state.activeViewName == "df"
                    ? true
                    : false
                }
                fontSize="1rem"
                height="100%"
                className="form-control"
                onChange={(newValue) => {
                  this.setState({ displaySQL: newValue });
                  this.noMessageAlert();
                }}
              ></AceEditor>
            </div>
            {this.renderMessage()}
          </div>
        </div>
      </div>
    );
  }
}

export default ProcessPanel;
