import React, { useState, useEffect } from 'react';
import Card from './Card';
import '../styles/Home.css';
import options from './assets/Display.svg';
import down from './assets/down.svg';
import backlog from './assets/Backlog.svg';
import todo from './assets/To-do.svg';
import inprogress from './assets/in-progress.svg';
import done from './assets/Done.svg';
import cancelled from './assets/Cancelled.svg';
import low from './assets/Img - Low Priority.svg';
import high from './assets/Img - High Priority.svg';
import medium from './assets/Img - Medium Priority.svg';
import nopriority from './assets/3 dot menu.svg';
import urgent from './assets/SVG - Urgent Priority colour.svg';
import profile from './assets/profile.png';

function Home() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isGroupingVisible, setIsGroupingVisible] = useState(false);



  const [isOrderingVisible, setIsOrderingVisible] = useState(false);

  const [selectedGrouping, setSelectedGrouping] = useState(() => localStorage.getItem('selectedGrouping') || 'Status');
  const [selectedOrder, setSelectedOrder] = useState(() => localStorage.getItem('selectedOrder') || 'Title');
  
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

 


  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => response.json())
      .then(data => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedGrouping', selectedGrouping);
  }, [selectedGrouping]);

  useEffect(() => {
    localStorage.setItem('selectedOrder', selectedOrder);
  }, [selectedOrder]);

  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);


  const toggleGrouping = () => setIsGroupingVisible(!isGroupingVisible);
  const toggleOrdering = () => setIsOrderingVisible(!isOrderingVisible); 

  const groupTickets = (groupingType) => {
    if (groupingType === 'Status') {
      return {
        backlog: tickets.filter(ticket => ticket.status === 'Backlog'),
        todo: tickets.filter(ticket => ticket.status === 'Todo'),
        inProgress: tickets.filter(ticket => ticket.status === 'In progress'),
        done: tickets.filter(ticket => ticket.status === 'Done'),
        cancelled: tickets.filter(ticket => ticket.status === 'Cancelled')
      };
    } else if (groupingType === 'Priority') {
      return {
        urgentPriority: tickets.filter(ticket => ticket.priority === 4),
        highPriority: tickets.filter(ticket => ticket.priority === 3),
        mediumPriority: tickets.filter(ticket => ticket.priority === 2),
        lowPriority: tickets.filter(ticket => ticket.priority === 1),
        noPriority: tickets.filter(ticket => ticket.priority === 0)
      };
    } else if (groupingType === 'Users') {
      return users.reduce((acc, user) => {
        acc[user.name] = tickets.filter(ticket => ticket.userId === user.id);
        return acc;
      }, {});
    }
    return {};
  };

  const orderTickets = (ticketsToOrder) => {
    if (selectedOrder === 'Title') {
      return ticketsToOrder.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedOrder === 'Priority') {
      return ticketsToOrder.sort((a, b) => b.priority - a.priority);
    }
    return ticketsToOrder;
  };

  const closeDrop = ()=> (setIsDropdownVisible(!isDropdownVisible))

  const groupedTickets = groupTickets(selectedGrouping);

  const renderCards = (tickets) => {
    const orderedTickets = orderTickets(tickets); 
    return orderedTickets.map((ticket) => (
      <Card
        key={ticket.id}
        id={ticket.id}
        title={ticket.title}
        tag={ticket.tag ? ticket.tag : ''}
        priority={ticket.priority}
      />
    ));
  };

  const renderColumnHeadings = () => {
    if (selectedGrouping === 'Status') {
      return (
        <>
          <div className="col-head">
            <img src={backlog} alt="Backlog" />
            <p>Backlog</p>
          </div>
          <div className="col-head">
            <img src={todo} alt="Todo" />
            <p>Todo</p>
          </div>
          <div className="col-head">
            <img src={inprogress} alt="In Progress" />
            <p>In Progress</p>
          </div>
          <div className="col-head">
            <img src={done} alt="Done" />
            <p>Done</p>
          </div>
          <div className="col-head">
            <img src={cancelled} alt="Cancelled" />
            <p>Cancelled</p>
          </div>
        </>
      );
    } else if (selectedGrouping === 'Priority') {
      return (
        <>
          <div className="col-head">
            <img src={urgent} alt="Urgent" />
            <p>Urgent</p>
          </div>
          <div className="col-head">
            <img src={high} alt="High" />
            <p>High</p>
          </div>
          <div className="col-head">
            <img src={medium} alt="Medium" />
            <p>Medium</p>
          </div>
          <div className="col-head">
            <img src={low} alt="Low" />
            <p>Low</p>
          </div>
          <div className="col-head">
            <img src={nopriority} alt="No Priority" />
            <p>No Priority</p>
          </div>
        </>
      );
    } else if (selectedGrouping === 'Users') {
      return Object.keys(groupedTickets).map((user, index) => (
        <div className="col-head" key={user}>
          <img src={profile} alt={`User ${index + 1}`} />
          <p>{user}</p>
        </div>
      ));
    }
  };

  return (
    <div className="main" onClick={closeDrop}>
      <div className="options" onClick={e=>{e.stopPropagation()}}>
        <a onClick={toggleDropdown} className={isDropdownVisible ? 'open' : ''}>
          <img src={options} alt="Display" /> &nbsp;Display
          <span className="drop">
            <img src={down} alt="Dropdown" className="dropdown" />
          </span>
        </a>

        {isDropdownVisible && (
          <div className="dropdown-menu">
            <div className="dropdown-section">
              <p>Grouping</p>
              <div className="dropdown-box" onClick={toggleGrouping}>
                {selectedGrouping} <img src={down} alt="Dropdown icon" className="dropdown-icon" />
              </div>
              {isGroupingVisible && (
                <div className="dropdown-submenu">
                  <span onClick={() => { setSelectedGrouping('Status'); setIsGroupingVisible(false); }}>Status</span>
                  <span onClick={() => { setSelectedGrouping('Priority'); setIsGroupingVisible(false); }}>Priority</span>
                  <span onClick={() => { setSelectedGrouping('Users'); setIsGroupingVisible(false); }}>Users</span>
                </div>
              )}
            </div>

            <div className="dropdown-section">
              <p>Ordering</p>
              <div className="dropdown-box" onClick={toggleOrdering}>
                {selectedOrder} <img src={down} alt="Dropdown icon" className="dropdown-icon" />
              </div>
              {isOrderingVisible && (
                <div className="dropdown-submenu">
                  <span onClick={() => { setSelectedOrder('Title'); setIsOrderingVisible(false); }}>Title</span>
                  <span onClick={() => { setSelectedOrder('Priority'); setIsOrderingVisible(false); }}>Priority</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="col-headings">
        {renderColumnHeadings()}
      </div>

      <div className="home">
        {selectedGrouping === 'Status' && (
          <>
            <div className="col-1">{renderCards(groupedTickets.backlog)}</div>
            <div className="col-2">{renderCards(groupedTickets.todo)}</div>
            <div className="col-3">{renderCards(groupedTickets.inProgress)}</div>
            <div className="col-4">{renderCards(groupedTickets.done)}</div>
            <div className="col-5">{renderCards(groupedTickets.cancelled)}</div>
          </>
        )}
        {selectedGrouping === 'Priority' && (
          <>
            <div className="col-1">{renderCards(groupedTickets.urgentPriority)}</div>
            <div className="col-2">{renderCards(groupedTickets.highPriority)}</div>
            <div className="col-3">{renderCards(groupedTickets.mediumPriority)}</div>
            <div className="col-4">{renderCards(groupedTickets.lowPriority)}</div>
            <div className="col-5">{renderCards(groupedTickets.noPriority)}</div>
          </>
        )}
        {selectedGrouping === 'Users' && Object.keys(groupedTickets).map((user, index) => (
          <div className={`col-${index + 1}`} key={user}>
            {renderCards(groupedTickets[user])}
          </div>
        ))}
      </div>
      <div className="footer" style={{fontSize:'12px'}}>Created by Surya M.U / musurya2014@gmail.com</div>
    </div>
  );
}

export default Home;
