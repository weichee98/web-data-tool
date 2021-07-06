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

  setDataFrame(df, colDtypes) {
    // TODO: reset sql tables
    this.setState({
      df: df,
      colDtypes: colDtypes,
    });
    this.dataPanel.current.setDataFrame(this.df);
    this.statsPanel.current.setDataFrame(this.df, this.colDtypes);
  }
}

export default ProcessPanel;
