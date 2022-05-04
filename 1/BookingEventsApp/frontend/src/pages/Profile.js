import React, { Component } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../context/auth-context';

class ProfilePage extends Component {
    state = {
        me: null
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.email = React.createRef();
        this.password = React.createRef();
        this.oldpassword = React.createRef();
        this.address = React.createRef();
        this.firstname = React.createRef();
        this.lastname = React.createRef();
        this.city = React.createRef();
        this.phone = React.createRef();
    }

  componentDidMount() {
    this.fetchProfile();
  }

  fetchProfile = () => {
    const requestBody = {
      query: `
          query {
            user(userId: "${localStorage.getItem('jwtUserId')}") 
            {
                _id
                email
                password
                city
                address
                phone
                firstname
                lastname
            }
          }
        `
    };

    console.log(requestBody)

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const user = resData.data.user;
        this.setState({ me: user});
        this.email.current.value = user.email;
        this.password.current.value = "";
        this.oldpassword.current.value = user.password;
        this.address.current.value = user.address;
        this.firstname.current.value = user.firstname;
        this.lastname.current.value = user.lastname;
        this.city.current.value = user.city;
        this.phone.current.value = user.phone;
      })
      .catch(err => {
        console.log(err);
      });
  };

  updateUserHandler = (e) => {
    e.preventDefault();
    const requestBody = {
      query: `
        mutation {
            updateUser(userInput: {_id: "${this.state.me._id}",email: "${this.email.current.value}", password: "${this.password.current.value}", firstname: "${this.firstname.current.value}", lastname: "${this.lastname.current.value}", address: "${this.address.current.value}", city: "${this.city.current.value}", phone: "${this.phone.current.value}"})
            {
                _id
            }
        }
        `
    };
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
    .then(res => {
    if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
    }
    return res.json();
    })
    .then(resData => {
        console.log(resData)
    if(resData.errors != null && resData.errors.length != 0) {
        toast.error(resData.errors[0].message, {
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
        toast('Your account is successfully updated', {
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
  });
}

  render() {
      return(
    <form className="auth-form" onSubmit={this.updateUserHandler}>
        <div>
            <h1>
              My profile
            </h1>
          </div>
          <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            <input type="email" required id="email" ref={this.email} />
          </div>
          <div className="form-control">
            <label htmlFor="firstname">First Name</label>
            <input type="text" required id="firstname" ref={this.firstname} />
          </div>
          <div className="form-control">
            <label htmlFor="lastname">Last Name</label>
            <input type="text" required id="lastname" ref={this.lastname} />
          </div>
          <div className="form-control">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" ref={this.address} />
          </div>
          <div className="form-control">
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" ref={this.phone} />
          </div>
          <div className="form-control">
            <label htmlFor="city">City</label>
            <input type="text" id="city" ref={this.city} />
          </div>
          <div className="form-control">
            <label htmlFor="oldpassword">Old password</label>
            <input type="text" required id="oldpassword" ref={this.oldpassword} />
          </div>
          <div className="form-control">
            <label htmlFor="password">New password</label>
            <input type="text" required id="password" ref={this.password} />
          </div>
          <div className="form-actions">
            <button type="submit">Save</button>
          </div>
        </form>
      )}
}

export default ProfilePage;
