import "./Navigation.css";
import React, { Component } from "react";
import PropTypes from "prop-types";

class Navigation extends Component {
  constructor(props) {
    super(props);
  }

  get children() {
    return [
      { name: "Home", ref: "/" },
      { name: "Visualize", ref: "/visualize" },
    ];
  }

  static get propTypes() {
    return {
      active: PropTypes.string.isRequired,
    };
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark main-navbar">
        <div className="navbar-nav">
          {this.children.map(({ name, ref }, i) => {
            var className = "navbar-item nav-link";
            if (this.props.active === name) {
              className += " active";
            }
            return (
              <a key={i} className={className} href={ref}>
                {name}
              </a>
            );
          })}
        </div>
      </nav>
    );
  }
}

export default Navigation;
