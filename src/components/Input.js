import "./Input.css";
import React, { Component } from "react";
import PropTypes from "prop-types";

class SingleSelect extends Component {
  constructor(props) {
    super(props);
    this.select = React.createRef();
  }

  get value() {
    return this.select.current.value;
  }

  static get propTypes() {
    return {
      label: PropTypes.string.isRequired,
      options: PropTypes.instanceOf(Array).isRequired,
    };
  }

  render() {
    return (
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text">{this.props.label}</label>
        </div>
        <select className="form-select" ref={this.select}>
          {this.props.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

class MultiSelect extends Component {
  constructor(props) {
    super(props);
    this.select = React.createRef();
  }

  get value() {
    var checkboxes = this.select.current.querySelectorAll(
      "label input:checked"
    );
    var result = [];
    checkboxes.forEach((checkbox) => {
      result.push(checkbox.value);
    });
    return result;
  }

  static get propTypes() {
    return {
      label: PropTypes.string,
      options: PropTypes.instanceOf(Array).isRequired,
    };
  }

  render() {
    return (
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text">{this.props.label}</label>
        </div>
        <div className="multi-select form-select" multiple>
          <div ref={this.select}>
            {this.props.options.map((opt) => (
              <label key={opt} className="dropdown-item">
                <input type="checkbox" value={opt}></input>
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export { SingleSelect, MultiSelect };
