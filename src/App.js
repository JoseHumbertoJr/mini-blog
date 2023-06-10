import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home/Home";
import About from './pages/About/About';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { AuthProvider } from './context/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuthentication } from './hooks/useAuthentication';
import CreatePoster from './pages/Poster/CreatePoster';
import Dashboard from './pages/Dashboard/Dashboard';
import Busca from './pages/Busca/Busca';
import Post from './pages/Post/Post';
import EditPoster from './pages/EditPoster/EditPoster';

function App() {
  const [user, setUser] = useState(undefined);
  const {auth} = useAuthentication();
  const loadingUser = user === undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    })
  }, [auth]);

  if(loadingUser) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <AuthProvider value={{user}}>
        <BrowserRouter>
          <NavBar/>
          <div className="container">
            <Routes>
              <Route  path='/' element={ <Home/> }/>
              <Route path='about' element={ <About/> } />
              <Route path='/busca' element={ <Busca/> } />            
              <Route path='/posts/:id' element={ <Post/> } />
              <Route path='/login' element={ !user ? <Login/> : <Navigate to="/" />} />
              <Route path='/register' element={ !user ? <Register/> : <Navigate to="/" />} />              
              <Route path='/posts/criar-post' element={ user ? <CreatePoster/> : <Navigate to="/login"/> } />
              <Route path='/posts/edit/:id' element={ user ? <EditPoster/> : <Navigate to="/login"/> } />
              <Route path='/dashboard' element={ user ? <Dashboard/> : <Navigate to="/login" />} />            
            </Routes>
          </div>
          <Footer/>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
