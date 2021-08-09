import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, Visualize } from "./pages";

function App() {
  return (
    <div className="App" style={{ textAlign: "center", height: "100%" }}>
      <Router>
        <Switch>
          <Route path="/" exact component={() => <Home></Home>}></Route>
          <Route
            path="/visualize"
            exact
            component={() => <Visualize></Visualize>}
          ></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
