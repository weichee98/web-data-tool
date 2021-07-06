import "./ProcessPanel.css";
import React, { Component } from "react";
import { DataFrame } from "dataframe-js";
import PropTypes from "prop-types";
// import DTypes from "../utils/DataTypes";

class ProcessPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      df: new DataFrame([]),
      colDtypes: {},
    };
    this.dataPanel = React.createRef();
    this.statsPanel = React.createRef();
  }

  static get propTypes() {
    return {
      processPanelHeight: PropTypes.string,
      dataPanelHeight: PropTypes.string,
      navigatorHeight: PropTypes.string,
    };
  }

  get buttons() {
    return [
      { name: "New", onClick: this.newView },
      { name: "Save", onClick: this.saveView },
      { name: "Delete", onClick: this.deleteView },
      { name: "Download CSV", onClick: this.downloadCSV },
      { name: "Download SQL", onClick: this.downloadSQL },
      { name: "Render", onClick: this.renderDataPanel },
    ];
  }

  setDataFrame(df, colDtypes) {
    // TODO: reset sql tables
    this.setState({
      df: df,
      colDtypes: colDtypes,
    });
    this.dataPanel.current.setDataFrame(this.df);
    this.statsPanel.current.setDataFrame(this.df, this.colDtypes);
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

        <div className="process-main-container">
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
                </div>
              </div>
            </div>
          </div>
          <div className="card-body process-input-panel" style={{ flex: 5 }}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">View Name</span>
              </div>
              <input type="text" className="form-control" disabled></input>
            </div>
            <div className="input-group mb-3" style={{ height: "100%" }}>
              <div className="input-group-prepend">
                <span className="input-group-text">SQL</span>
              </div>
              <div className="form-control" style={{ height: "100%" }}></div>
            </div>
            <div
              className="alert alert-primary status-description"
              role="alert"
            >
              No message to display
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProcessPanel;
