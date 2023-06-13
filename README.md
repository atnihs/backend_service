# Get Started

`cd project_direcrtory`

`npm install`

`npm install knex -g`

`knex migrate:latest`

`knex seed:run`

`npm run start:dev`

# Migration
### Create Migration

`knex migrate:make migration_name`

### Run Migrate

`knex migrate:up`

### Rollback Migrate

`knex migrate:down`


### Run All Migrate

`knex migrate:latest`

### Rollback All Migrate

`knex migrate:rollback --all`

### Import data from seeds

`knex seed:run`
