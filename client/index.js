const axios = require('axios');

axios.get('http://192.168.56.11:3000/users')
  .then(response => {
    console.log('Users from backend:');
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error calling service:', error.message);
  });
