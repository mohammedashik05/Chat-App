import { Link } from 'react-router-dom';

const App = () => {
  return (
    <>
      <h1>Welcome to Home Page</h1>
      <nav>
        <Link to="/signin">Sign In</Link> |{' '}
        <Link to="/signup">Sign Up</Link> |{' '}
        <Link to="/updatepass">Reset Password</Link>
       
      </nav>
    </>
  );
};

export default App;
