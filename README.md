# StudyBroker Backend

This is the backend for the `StudyBroker` web-application project

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

| Variable               | Type     | Description               |
| :--------------------- | :------- | :------------------------ |
| `PORT`                 | `int`    | Port to run server        |
| `GITHUB_CLIENT_ID`     | `string` | GitHub OAuth ID           |
| `GITHUB_CLIENT_SECRET` | `string` | GitHub OAuth Secret       |
| `APP_URI`              | `string` | Frontend APP URL          |
| `CORS_ORIGIN`          | `string` | Allowed CORS URLs         |
| `SESSION_SECRET`       | `string` | Random value for sessions |
| `MONGO_URI`            | `string` | URL for Mongo Database    |
| `ALPACA_API`           | `string` | Alpaca API URL            |
| `ALPACA_KEY`           | `string` | Alpaca API Key            |
| `ALPACA_SECRET`        | `string` | Alpaca API Secret         |

## Installation

Install required node modules

```bash
npm install
```

## Deployment

### Run Server

```bash
npm run start
```

### Run Server with Hot-Reload (Development)

```bash
npm run dev
```

## Appendix

This app is created for a study project and is not suitable for productive deployment!
