import "./Header.css";
import React, { Component } from "react";
import PropTypes from "prop-types";

class Header extends Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      text: PropTypes.string.isRequired,
      style: PropTypes.style.isRequired,
    };
  }

  render() {
    return (
      <div
        className="bs-docs-header bg-dark header-title"
        style={this.props.style}
      >
        <div className="container">
          <h1 className="display-3 text-white">{this.props.text}</h1>
        </div>
      </div>
    );
  }
}

export default Header;
