# MBG UI

## Development

Node version: 21

```bash
cd mbg-ui
npm install
npm run dev
```

Open in http://localhost:5173

Create environment variables on `mbg-ui/.env`.
```
VITE_MAPLIBRE_MAPSTYLE=https://basemaps.cartocdn.com/gl/positron-gl-style/style.json
VITE_BACKEND_SERVICE_BASE_URL=http://localhost:5000
```