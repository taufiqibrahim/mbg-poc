// import { Map, Layer, Source, Marker } from 'react-map-gl/maplibre'
import type { CircleLayer, FillLayer, LineLayer, SymbolLayer } from 'react-map-gl/maplibre'
import arrowImage from './arrow.png'

// UP location marker
export const upLayer: CircleLayer = {
    id: 'up-location',
    type: 'circle',
    source: 'up-source',
    paint: {
        "circle-radius": 16,
        "circle-color": "red",
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2,
    }
}

export const sekolahLayer: CircleLayer = {
    id: 'sekolah-location-symbol',
    type: 'circle',
    source: 'sekolah-source',
    paint: {
        "circle-radius": 6,
        "circle-color": "green",
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2,
    }
}

export const routeLayer: LineLayer = {
    id: 'route',
    type: 'line',
    source: 'route-source',
    layout: {
        "line-join": 'miter',
    },
    paint: {
        "line-color": "red",
    }
}

export const routeDirectionSymbolLayer: SymbolLayer = {
    id: 'route',
    type: 'symbol',
    source: 'route-source',
    layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 50,
        'icon-image': 'arrow',
        'icon-size': 0.5,
    }
}

export const sekolahTextLabelLayer: SymbolLayer = {
    id: 'sekolah-location-text-symbol',
    type: 'symbol',
    source: 'sekolah-source',
    'layout': {
        "text-field": [
            "format",
            ['get', 'name'], { "font-scale": 1 },
        ],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-size': 10
    },
    'paint': {
        'text-color': 'black',
        "text-halo-color": 'white',
        "text-halo-width": 1,
        'text-opacity': 1,
    }
}

// Isochrone layers
export const isochroneFillLayer: FillLayer = {
    id: 'isochrone-fill-layer',
    type: 'fill',
    source: 'isochrone-source',
    paint: {
        'fill-color': '#4E3FC8',
        'fill-opacity': 0.5,
        'fill-outline-color': '#FFFFFF',
    }
}

export const isochroneLineLayer: LineLayer = {
    id: 'isochrone-layer-line',
    type: 'line',
    source: 'isochrone-source',
    paint: {
        'line-color': '#FFFFFF',
        'line-width': 2,
    }
}
