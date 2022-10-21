## Installation

```bash
cp .env.example .env
# edit the .env if needed

docker-compose up &

# The back may crash when the DB is starting; in this case, restart it after DB is up
docker-compose restart back
```
Le front utilise le port 3004, et le back le 3003.

## Usage
http://localhost:3003
