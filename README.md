# Scribblez Database

A PostgreSQL database for a simple note-sharing social network.

[Entity Relationship Diagram](diagram.svg)

## Installation

1. Install dependencies

    ```
    npm install
    ```

2. Create `knexfile.js`

    ```
    cp knexfile.example.js knexfile.js
    ```

3. Edit connection settings in `knexfile.js`

4. Create a symlink to the knex executable (for convience)

    ```
    ln -s node_modules/knex/bin/cli.js knex
    ```

5. Run migrations

    ```
    ./knex migrate:latest
    ```

6. Seed database with sample data (optional)

    ```
    ./knex seed:run
    ```
