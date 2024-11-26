# Library Manager

Library Management Software written in Vanilla HTML/CSS, JS and Node.Js.

> [!WARNING]
> Currently in Dev.

## Requirements

- Node.Js
  - express
  - sqlite3
  - dotenv
  - nodemon
  - CORS

## Quick Start

### Ports

- FrontEnd `3000`
- BackEnd `5000`

### Steps

1. Create .env file in `BackEnd` directory

    ```ini
    # .env
    PORT = <PORT>
    DB_NAME = "<name of your sqlite database>"
    ```

2. Run the following commands

    ```bash
    # FrontEnd
    cd ./FrontEnd
    npm install
    npm run dev
    ```

    ```bash
    # BackEnd
    cd ./BackEnd
    npm install
    npm run dev
    ```

The frontend should be running on [http://localhost:3000](http://localhost:3000).

The backend should be running on [http://localhost:5000](http://localhost:5000). (Not to be accessed via browser)

## Features

1. Add, Issue and Delete Books.

2. Add and Delete Members.

more features coming soon...

[ucx15 @ GitHub](https://github.com/ucx15)
