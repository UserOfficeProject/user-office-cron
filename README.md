Node cron job service for ESS User Office project.

## Usage

Before you run you should make sure that `API_AUTH_TOKEN` environment variable is set with valid jsonwebtoken.<br>

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