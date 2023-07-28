import logo from "./logo.svg";
import "./App.css";
import Form from "./components/Form";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Form />
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
