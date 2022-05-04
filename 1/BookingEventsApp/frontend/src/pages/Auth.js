import React, { Component } from 'react';
import { toast } from 'react-toastify';
import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.email = React.createRef();
    this.password = React.createRef();
    this.address = React.createRef();
    this.firstname = React.createRef();
    this.lastname = React.createRef();
    this.city = React.createRef();
    this.phone = React.createRef();
  }

  submitSigninHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    console.log(email + " " + password)

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query { 
          login(email: "${email}", password: "${password}") { 
            userId 
            token 
            tokenExpiration 
          } 
        }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
      
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          toast('Wrong email or password!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          //throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
          toast('Successfully login', {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        }
      })
      .catch(err => {
        console.log(err);
        toast(err, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      });
  };

  

  submitSignupHandler = event => {
    event.preventDefault();
    const email = this.email.current.value;
    const password = this.password.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        mutation {
          createUser(userInput: {email: "${email}", password: "${password}", firstname: "${this.firstname.current.value}", lastname: "${this.lastname.current.value}", address: "${this.address.current.value}", city: "${this.city.current.value}", phone: "${this.phone.current.value}"}) {
            _id
            email
          }
        }
      `
    };

    console.log(requestBody)

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
      
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.errors != null && resData.errors.length > 0) {
          console.log(resData)
          toast(resData.errors[0].message, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        }
        else {
          toast('Successfully signup', {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        }
      })
      .catch(err => {
        console.log(err);
        toast(err, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      });
  };

  render() {
    return (
      <div>
        <form className="auth-form" onSubmit={this.submitSigninHandler}>
          <div>
            <h1>
              Signin form
            </h1>
          </div>
          <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            <input type="email" required id="email" ref={this.emailEl} />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" required id="password" ref={this.passwordEl} />
          </div>
          <div className="form-actions">
            <button type="submit">Signin</button>
          </div>
        </form>
        <form className="auth-form" onSubmit={this.submitSignupHandler}>
        <div>
            <h1>
              Signup form
            </h1>
          </div>
          <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            <input type="email" required id="email-signup" ref={this.email} />
          </div>
          <div className="form-control">
            <label htmlFor="firstname">First Name</label>
            <input type="text" required id="firstname-signup" ref={this.firstname} />
          </div>
          <div className="form-control">
            <label htmlFor="lastname">Last Name</label>
            <input type="text" required id="lastname-signup" ref={this.lastname} />
          </div>
          <div className="form-control">
            <label htmlFor="address">Address</label>
            <input type="text" id="address-signup" ref={this.address} />
          </div>
          <div className="form-control">
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone-signup" ref={this.phone} />
          </div>
          <div className="form-control">
            <label htmlFor="city">City</label>
            <input type="text" id="city-signup" ref={this.city} />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" required id="password-signup" ref={this.password} />
          </div>
          <div className="form-actions">
            <button type="submit">Signup</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AuthPage;
