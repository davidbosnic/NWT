import React, { Component } from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthPage from './pages/Auth';
import ProfilePage from './pages/Profile';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  constructor(){
    super();
    this.state.token = localStorage.getItem('jwtToken');
    this.state.userId = localStorage.getItem('jwtUserId');
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('jwtUserId', userId);
  };

  logout = () => {
    this.setState({ token: null, userId: null });
    localStorage.setItem('jwtToken', '');
    localStorage.setItem('jwtUserId', '');
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Routes>
                <Route path="/" element={this.state.token ? <Navigate to="/events" /> : <AuthPage/>} />
                <Route path="/auth" element={this.state.token ? <Navigate to="/events" /> : <AuthPage/>} />
                <Route element={!this.state.token && <Navigate to="/auth" />} />
                <Route path="/auth" element={this.state.token ? <Navigate to="/" /> : <AuthPage/>} />
                <Route path="/events" element={this.state.token ? <EventsPage/> : <AuthPage/>} />
                <Route path="/profile" element={this.state.token ? <ProfilePage/> : <AuthPage/>} />
                <Route path="/bookings" element={<BookingsPage/>} />                
              </Routes>
            </main>
            <ToastContainer />
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
