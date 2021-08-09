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

  onClick(event) {
    event.preventDefault();
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
      <div className="card text-center">
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

class LeftTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.children[1].props.label,
    };
    this.onClickTabItem = this.onClickTabItem.bind(this);
  }

  static get propTypes() {
    return {
      height: PropTypes.string,
      tabFlex: PropTypes.number,
      containerFlex: PropTypes.number,
      children: PropTypes.instanceOf(Array).isRequired,
    };
  }

  onClickTabItem(tab) {
    this.setState({ activeTab: tab });
  }

  render() {
    return (
      <div className="card text-center">
        <div className="card-header">
          <ol className="nav nav-tabs card-header-tabs">
            {this.props.children
              .slice(1, this.props.children.length)
              .map((child) => {
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
        <div
          style={{
            display: "flex",
            height: this.props.height || "auto",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="card-body text-center"
            style={{ flex: this.props.tabFlex || 1 }}
          >
            {this.props.children
              .slice(1, this.props.children.length)
              .map((child) => {
                if (child.props.label !== this.state.activeTab)
                  return undefined;
                return child;
              })}
          </div>
          <div
            style={{
              flex: this.props.containerFlex || 1,
              height: "100%",
              width: "100%",
              overflow: "auto",
            }}
          >
            {this.props.children[0]}
          </div>
        </div>
      </div>
    );
  }
}

class RightTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.children[1].props.label,
    };
    this.onClickTabItem = this.onClickTabItem.bind(this);
  }

  static get propTypes() {
    return {
      height: PropTypes.string,
      tabFlex: PropTypes.number,
      containerFlex: PropTypes.number,
      children: PropTypes.instanceOf(Array).isRequired,
    };
  }

  onClickTabItem(tab) {
    this.setState({ activeTab: tab });
  }

  render() {
    return (
      <div className="card text-center">
        <div className="card-header">
          <ol className="nav nav-tabs card-header-tabs">
            {this.props.children
              .slice(1, this.props.children.length)
              .map((child) => {
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
        <div
          style={{
            display: "flex",
            height: this.props.height || "auto",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              flex: this.props.containerFlex || 1,
              height: "100%",
              width: "100%",
              overflow: "auto",
            }}
          >
            {this.props.children[0]}
          </div>
          <div
            className="card-body text-center"
            style={{ flex: this.props.tabFlex || 1 }}
          >
            {this.props.children
              .slice(1, this.props.children.length)
              .map((child) => {
                if (child.props.label !== this.state.activeTab)
                  return undefined;
                return child;
              })}
          </div>
        </div>
      </div>
    );
  }
}

export { Tabs, LeftTabs, RightTabs };
