###  My follow-along code for *Node.js - The Complete Guide* on Udemy

Added Docker container to avoid installing MySQL, so rather than `npm start`
```
docker-compose up -d && docker-compose logs -f
```

Another thing, the host name in the container is `mysql` rather than `localhost` (I named the db `node_complete` rather than`node-complete` to avoid having to type backticks)
```javascript
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'mysql',
    user: 'root',
    database: 'node_complete',
    password: 'root_password'
});

module.exports = pool.promise();
```
