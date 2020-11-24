import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Host from './components/Host';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/host' component={Host} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
