#  Coding along with [*NodeJS - The Complete Guide*](https://www.udemy.com/course/nodejs-the-complete-guide/)

## Getting Started

### Clone and set up the project

```sh
git clone git@github.com:evokateur/nodejs-complete-guide.git
cd nodejs-the-complete-guide
npm install
```

### Configure MySQL connection

```sh
cp .env.example .env
```

Edit vars in `.env`

```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

I'm using Railway and use these values from the output of `railway variables`

- `RAILWAY_TCP_PROXY_DOMAIN` for `DB_HOST`
- `RAILWAY_TCP_PROXY_PORT` for `DB_PORT`

### Run migrations

by commenting out `.sync()` and commenting in `.sync({force: true})` in the `sequelize` block of `app.js`

```js
sequelize
    .sync()
    // .sync({alter: true})
    // .sync({force: true})
    .then(result => {...
```

then starting the app at http://localhost:3000/

```sh
npm start
```

Undo the change to avoid clobbering the data each time you start.
