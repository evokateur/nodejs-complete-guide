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

[ *we are working on this one..* ]

### Start the app

```sh
npm start
```

 http://localhost:3000/
