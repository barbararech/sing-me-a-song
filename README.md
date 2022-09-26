# <p align = "center"> Sing me a song </p>

<p align="center">
   <img src="https://www.pngall.com/wp-content/uploads/2/Sound-Waves-PNG.png"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-Bárbara_Rech-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/barbararech/sing-me-a-song?color=4dae71&style=flat-square" />
</p>


##  :clipboard: Description

An app for you to share music recommendations, as well as being able to vote on the recommendation of others!


## 🏁 Configuring the application

This project was initialized with [Create React App](https://github.com/facebook/create-react-app), so make 
sure you have the latest stable version of [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/) running locally.

First, clone this repository:

```
git clone https://github.com/barbararech/sing-me-a-song
```
### For the back-end folder

Inside the folder, run the following command to install the dependencies.

```
npm install
```

Run the following command to install the dev dependencies.

```
npm install dotenv-cli jest prisma supertest ts-jest ts-node typescrypt nodemon eslint @faker-js/faker @types/cors @types/dotenv @types/express @types/jest @types/joi @types/node @types/supertest -D
```

Create database

```
npx prisma migrate dev
```
### For the front-end folder

Inside the folder, run the following command to install the dependencies.

```
npm install
```

:stop_sign: Don't forget to set the environment variables!

## 🏁 Running the tests

### For the integration test

Inside the back-end folder, run the following command to start the tests.

```
npm run test:integration
```
### For the unit test

Inside the back-end folder, run the following command to start the tests.

```
npm run test:unit
```

### For the e2e test

Inside the back-end folder, run the following command to run the server.

```
npm run dev
```

Inside the front-end folder, run the following command to run the app.

```
npm start
```

Inside the front-end folder, run the following command to start the tests.

```
npx cypress open
```









