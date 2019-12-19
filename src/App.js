import React, { useState, useEffect } from 'react';
import { getAll } from './modules/apiManager';
import { getUserInfo } from './modules/helpers';
import { reverse, sortBy } from 'lodash';
import { ReactComponent as Logo } from './assets/Logo.svg';
import Login from './components/auth/Login';
import FestList from './components/fest/FestList';
import Schedule from './components/schedule/Schedule';
import Timeline from './components/timeline/Timeline';
import './App.css';

const sortDescending = (arr, sortKey) => reverse(sortBy(arr, sortKey));

export default () => {
  const [scheduleId, setScheduleId] = useState('');
  const [user, setUser] = useState(getUserInfo());
  const [userFests, setUserFests] = useState([]);
  const [newsFests, setNewsFests] = useState([]);

  const getAllFests = () => { 
    getAll('events?public=true')
      .then(fests => {
        if (user) {
          getAll('usersToEvents?_expand=event')
            .then(events => {
              const currUserFests = events.filter(({ userId }) => user.id === userId);
              const currUserFestIds = currUserFests.map(({ eventId }) => eventId);
              const filteredFests = fests.filter(({ id }) => !currUserFestIds.includes(id));
              const sortedUserFests = sortDescending(currUserFests, 'start');

              setNewsFests(sortDescending(filteredFests, 'modifiedAt'));
              setUserFests(sortedUserFests);
            });   
        }

        else setNewsFests(sortDescending(fests, 'modifiedAt'));
      });
  };

  useEffect(getAllFests, [user]);
  
  const updateUser = user => setUser(user);
  const handleFestClick = id => setScheduleId(id);
  const updateFestList = arr => setNewsFests(arr); 

  return (
    <div className='avenir'>
      <header className='section-banner flex'>
        <section className='w-third'></section>
        <section className='w-third tc'><Logo /></section>
        <section className='w-third'><Login updateUser={updateUser}/></section>
      </header>
      <div className='container-main flex'>
        <section className='section-festList'>
          <FestList
            fests={newsFests}
            user={user}
            updateFestList={updateFestList}
            handleFestClick={handleFestClick}
            getAllFests={getAllFests}
          />
        </section>
        <section className='section-schedule'>
          <Schedule scheduleId={scheduleId} user={user}/>
        </section>
        <section className='section-timeline'>
          <Timeline handleFestClick={handleFestClick} fests={userFests}/>
        </section>
      </div>
      <footer className='absolute bottom-0'>
        <p className='f7 black-70 mb2'>Made by Manbootay | 2020</p>
      </footer>
    </div>
  );
}