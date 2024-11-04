# MBG API

## Development

```bash
cd mbg-api/app
pip install -r requirements.txt
fastapi dev
```

Create environment variables using `mbg-api/app/.env`.
```
SQLALCHEMY_DATABASE_URL=postgresql+psycopg2://USER:PASSWORD@HOST/DATABASE?sslmode=require
ISOCHRONE_SERVICE_URL=https://valhalla1.openstreetmap.de/isochrone
CORS_ORIGINS=*
```
