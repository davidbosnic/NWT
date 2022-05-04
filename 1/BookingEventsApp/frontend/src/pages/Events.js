import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import './Events.css';

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };
  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
    this.durationElRef = React.createRef();
    this.locationElRef = React.createRef();
    this.address = React.createRef();
    this.canceled = React.createRef();
    this.contact = React.createRef();
    this.maxNumberBookings = React.createRef();
    this.curNumberBookings = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;
    const location = this.descriptionElRef.current.value;
    const duration = this.durationElRef.current.value;
    const address = this.address.current.value;
    const contact = this.contact.current.value;
    const maxNumBookings = parseInt(this.maxNumberBookings.current.value);
    const canceled = false;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description, location, duration, address, contact, maxNumBookings, canceled };
    console.log(event);

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}", address: "${address}", location: "${location}", duration: ${duration}, maxNumBookings: ${maxNumBookings}, contact: "${contact}", canceled: false}) {
            _id
            title
            description
            date
            price
            location
            duration
            maxNumBookings
            curNumBookings
            contact
            address
            canceled
          }
        }
        `
    };
    const token = this.context.token;
    console.log("Token "+token);
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedEvents = [...prevState.events];
          console.log(resData)
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            location: resData.data.createEvent.location,
            address: resData.data.createEvent.address,
            contact: resData.data.createEvent.contact,
            duration: resData.data.createEvent.duration,
            curNumBookings: resData.data.createEvent.curNumBookings,
            maxNumBookings: resData.data.createEvent.maxNumBookings,
            canceled: resData.data.createEvent.canceled,
            creator: {
              _id: this.context.userId
            }
          });
          return { events: updatedEvents };
        });
        toast('Event is successfully created', {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  fetchEvents() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              location
              duration
              maxNumBookings
              curNumBookings
              contact
              address
              canceled
              creator {
                _id
                email
              }
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
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        console.log(resData);
        if (this.isActive) {
          this.setState({ events: events, isLoading: false });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    console.log(this.state.selectedEvent)
    const requestBody = {
      query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
             createdAt
             updatedAt
            }
          }
        `,
        variables: {
          id: this.state.selectedEvent._id
        }
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
        console.log(resData);
        this.setState({ selectedEvent: null });
        toast('Happy booking!', {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" required id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="maxNumberBookings">Max number of bookings</label>
                <input type="number" required min='1' id="maxNumberBookings" ref={this.maxNumberBookings} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" required min="0" step=".01" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="location">Location</label>
                <input type="text" required id="location" ref={this.locationElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="address">Address</label>
                <input type="text" id="address" ref={this.address} />
              </div>
              <div className="form-control">
                <label htmlFor="contact">Contact</label>
                <input type="text" required id="contact" ref={this.contact} />
              </div>
              <div className="form-control">
                <label htmlFor="duration">Duration</label>
                <input type="number" required min='0' id="duration " ref={this.durationElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" required id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? 'Book' : 'Confirm'}
          >
            <h1>Title: {this.state.selectedEvent.title}</h1>
            <h2>
              Event price and start date:  
              ${this.state.selectedEvent.price} -{' '}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>Description: {this.state.selectedEvent.description}</p>
            <p>Location: {this.state.selectedEvent.location}</p>
            <p>Duration: {this.state.selectedEvent.duration}h</p>
            <p>Address: {this.state.selectedEvent.address}</p>
            <p>Contact: {this.state.selectedEvent.contact}</p>
            <p>Number of bookings: {this.state.selectedEvent.curNumBookings}/{this.state.selectedEvent.maxNumBookings}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
