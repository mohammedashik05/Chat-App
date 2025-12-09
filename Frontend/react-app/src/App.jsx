import { Link } from 'react-router-dom';
import "./App.css";

const App = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Chat App</h1>

      <nav className="home-nav">
        <Link className="home-link" to="/signin">Sign In</Link>
        <Link className="home-link" to="/signup">Sign Up</Link>
        <Link className="home-link" to="/updatepass">Reset Password</Link>
      </nav>
    </div>
  );
};

export default App;
