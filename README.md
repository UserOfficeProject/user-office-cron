Node cron job service for ESS User Office project.

## Usage

Before you run you should create `.env.development` file for development mode and `.env` file for production mode in the project root directory. You can find `.env.example` file to have better overview of what enviromnent variables are required before you start.<br>

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode. `NOTE:` For this mode you need to have your local duo-backend up and running.<br>

### `npm run build`

Builds a `dmsc/duo-cron-job` docker image from the app which should be used in the User Office docker-compose.yml file. `NOTE:` You should have docker installed on your machine to run this command.<br>

### `npm run prod`

Runs the app in the production mode.<br>

### `npm test`

Launches the jest test runner with coverage report.<br>