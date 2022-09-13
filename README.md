# Tenet Backend Assessment

## Requirements & Running

- Docker daemon must be running on your system
- Yarn must be installed (not technically, you can just run `docker compose up` below if you don't have `yarn`)
- Copy `.env.sample` to new `.env` file (or just rename `.env.sample`)
- Run `yarn start`
- Run `yarn run migrate:latest` in `services/api-service` while DB container is running (only necessary once to migrate the DB schema)
- Test routes at root URL `http://localhost:8080/`

### Organization

- `services/` is usually a folder of microservices, but in this case just the one `api-service`. I still kept this organization for ease of addition and because I don't see any benefits gained by moving the folder structure "up a level"
