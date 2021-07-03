import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, Visualize, Process } from "./pages";

function App() {
  return (
    <div className="App" style={{ textAlign: "center" }}>
      <Router>
        <Switch>
          <Route path="/" exact component={() => <Home></Home>}></Route>
          <Route
            path="/visualize"
            exact
            component={() => <Visualize></Visualize>}
          ></Route>
          <Route
            path="/process"
            exact
            component={() => <Process></Process>}
          ></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
