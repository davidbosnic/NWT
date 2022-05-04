import { Calendar, momentLocalizer  } from 'react-big-calendar' 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
const localizer = momentLocalizer(moment)

const BookingsBigCalendar = props => {
  var bookings = props.bookings;
  var myEventsList = [];
  var id = 0;
  console.log(bookings);
  bookings.forEach(booking => {
    
    console.log(booking);
    var event = {};
    event.id = id;
    id++;
    event.title = booking.event.title;
    event.start = new Date(booking.event.date);
    event.end = new Date(booking.event.date);
    event.end.setTime(event.end.getTime() + (booking.event.duration*60*60*1000))   
    event.allDay = true;

    console.log(event);

    myEventsList.push(event);
  });

  return (
    <div style={{height: "800px"}}>
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
    />
  </div>
  );
};

export default BookingsBigCalendar;
