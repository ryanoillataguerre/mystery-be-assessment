# Mystery Backend Assessment

I made this "Mystery" in case any one happened to look up the company name + assessment and happen to find my profile

## Requirements & Running

- Docker daemon must be running on your system
- Yarn must be installed (not technically, you can just run `docker compose up` below if you don't have `yarn`)
- Copy `.env.sample` to new `.env` file (or just rename `.env.sample` to `.env`)
- Run `yarn` from `/mystery-be-assessment`
- Run `yarn start` from `/mystery-be-assessment`
- Run `yarn run migrate:latest` in `services/api-service` once DB container is running (only necessary once to migrate the DB schema)
- Test routes at root URL `http://localhost:8080/`
- You can import the Insomnia collection attached in the insomnia/ directory, assuming you're using Insomnia as your REST client
