import express = require('express');
import { createServer } from 'http';
import { Server } from 'socket.io';
import mockRestaurants = require('./data/restaurants.json');

const app = express();
const httpServer = createServer(app);
const socketServer = new Server(httpServer);

let lastRallyPoint = { lat: 48.89381286670934, lng: 2.2282290458679204 };

socketServer.on('connection', (socket) => {
  const thisId = socket.id;
  socket.on('updateUser', (data) => {
    socketServer.emit('updateUser',
      {
        id: socket.id,
        data,
      });
  });

  socket.on('newPosition', (data) => {
    socketServer.emit('newPosition', {
      id: socket.id,
      data,
    });
  });

  socket.on('updateRallyPoint', (data) => {
    socketServer.emit('updateRallyPoint', lastRallyPoint = data);
  });

  socket.on('updateRestaurant', (data) => {
    socketServer.emit('updateRestaurant', { id: thisId, data });
  });

  socket.on('disconnect', () => {
    console.log(thisId);
    socketServer.emit('removeClient', thisId);
  });

  socket.emit('init', {
    restaurants: mockRestaurants,
    rallyPoint : lastRallyPoint,
  });
  socket.emit('newPosition',
    {
      id  : socket.id,
      data: socket.handshake.auth,
    });
});

httpServer.listen(8000, () => console.log('Server ready'));
