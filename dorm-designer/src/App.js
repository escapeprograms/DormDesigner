import './App.css';

import Editor from './components/Editor/Editor';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LoginPage from './components/LoginPage/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path ="/" element = {<LoginPage/>}></Route>
        <Route exact path = "/editor" element = {<Editor/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
