import { useState, useEffect } from 'react';
import axios from 'axios';

function TrainList() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => {
        setTrains(response.data);
      })
      .catch(error => {
        console.error('Error fetching train data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Train List</h1>
      <table>
        <thead>
          <tr>
            <th>Train Name</th>
            <th>Train Number</th>
            <th>Departure Time</th>
            <th>Seats Available</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {trains.map(train => (
            <tr key={train.trainNumber}>
              <td>{train.trainName}</td>
              <td>{train.trainNumber}</td>
              <td>{`${train.departureTime.Hours}:${train.departureTime.Minutes}`}</td>
              <td>{`Sleeper: ${train.seatsAvailable.sleeper}, AC: ${train.seatsAvailable.AC}`}</td>
              <td>{`Sleeper: ${train.price.sleeper}, AC: ${train.price.AC}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrainList;
