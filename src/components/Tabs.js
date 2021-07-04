import React, { Component } from "react";
import PropTypes from "prop-types";

class Tab extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  static get propTypes() {
    return {
      activeTab: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    };
  }

  onClick() {
    const { label, onClick } = this.props;
    onClick(label);
  }

  render() {
    var className = "nav-link";
    if (this.props.activeTab === this.props.label) {
      className += " active";
    }
    return (
      <li className="nav-item" onClick={this.onClick}>
        <a className={className} href="#">
          {this.props.label}
        </a>
      </li>
    );
  }
}

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.children[0].props.label,
    };
    this.onClickTabItem = this.onClickTabItem.bind(this);
  }

  static get propTypes() {
    return {
      children: PropTypes.instanceOf(Array).isRequired,
    };
  }

  onClickTabItem(tab) {
    this.setState({ activeTab: tab });
  }

  render() {
    return (
      <div className="card text-center bg-light">
        <div className="card-header">
          <ol className="nav nav-tabs card-header-tabs">
            {this.props.children.map((child) => {
              const { label } = child.props;
              return (
                <Tab
                  activeTab={this.state.activeTab}
                  key={label}
                  label={label}
                  onClick={this.onClickTabItem}
                />
              );
            })}
          </ol>
        </div>
        <div className="card-body text-center">
          {this.props.children.map((child) => {
            if (child.props.label !== this.state.activeTab) return undefined;
            return child;
          })}
        </div>
      </div>
    );
  }
}

export default Tabs;
