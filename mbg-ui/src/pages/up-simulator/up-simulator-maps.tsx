import { Map, Layer, Source } from 'react-map-gl/maplibre'
import type { CircleLayer, FillLayer, LineLayer, MapRef, SymbolLayer } from 'react-map-gl/maplibre'
import type { FeatureCollection } from 'geojson'
import { useEffect, useRef, useState } from "react"
import bbox from '@turf/bbox'

interface Sekolah {
  npsn: string;
  name: string;
  pd: number;
  longitude: number;
  latitude: number;
}

interface UpData {
  type: string;
  geometry: any;
}

export default function UpSimulatorMaps(props: any) {

  const [upData, setUpData] = useState<UpData>()
  const [isochroneData, setIsochroneData] = useState(null)
  const [sekolahData, setSekolahData] = useState<FeatureCollection>()
  const mapRef = useRef<MapRef>()


  const convertToPointFeatures = (locations: Sekolah[]) => {
    const features = locations.map((location: Sekolah) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
      properties: {
        npsn: location.npsn,
        name: location.name,
        pd: location.pd,
      },
    }));
    return features;
  };


  useEffect(() => {
    console.log(props)
    // Check props.simulatorData
    if (props?.simulatorData?.update === true) {
      // console.log("Update", props)

      // Set UP geojson
      setUpData({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [props.simulatorData.longitude, props.simulatorData.latitude] }
      })

      // Set UP geojson
      const features = convertToPointFeatures(props.simulatorData.data_sekolah);
      // console.log(features)

      // @ts-ignore
      setSekolahData({
        type: 'FeatureCollection',
        // @ts-ignore
        features: features
      });
      console.log('sekolahData', sekolahData)

      // Get isochrone geojson
      const isochrone = props.simulatorData.isochrone.features[0]

      // Check if isochrone available
      console.log("check isochroner", isochrone)
      if (isochrone !== null) {
        // Update isochrone state
        setIsochroneData(isochrone)
        // Fitbound to isochrone
        const [minLng, minLat, maxLng, maxLat] = bbox(isochrone)
        // console.log([minLng, minLat, maxLng, maxLat])

        if (mapRef && mapRef?.current) {
          console.log('fitbound')
          mapRef.current.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat]
            ],
            { padding: 40, duration: 1000 }
          );
        }
      }

    }

  }, [props])


  // UP location marker
  const upLayer: CircleLayer = {
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

  // sekolah location marker
  // const sekolahLayer: SymbolLayer = {
  //   id: 'sekolah-location-symbol',
  //   type: 'symbol',
  //   source: 'sekolah-source',
  //   paint: {
  //     "icon-image": 
  //     "icon-color": "green",
  //   }
  // }
  const sekolahLayer: CircleLayer = {
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
  const sekolahTextLabelLayer: SymbolLayer = {
    id: 'sekolah-location-text-symbol',
    type: 'symbol',
    source: 'sekolah-source',
    'layout': {
      // "text-field": "$npsn",
      "text-field": [
        "format",
        ['get', 'name'], { "font-scale": 1.2 },
      ],
      // 'text-field': [
      //   // 'npsn'
      //   // 'number-format',
      //   ['get', 'npsn'],
      //   // { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }
      // ],
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
  const isochroneFillLayer: FillLayer = {
    id: 'isochrone-fill-layer',
    type: 'fill',
    source: 'isochrone-source',
    paint: {
      'fill-color': '#4E3FC8',
      'fill-opacity': 0.5,
      'fill-outline-color': '#FFFFFF',
    }
  };

  const isochroneLineLayer: LineLayer = {
    id: 'isochrone-layer-line',
    type: 'line',
    source: 'isochrone-source',
    paint: {
      'line-color': '#FFFFFF',
      'line-width': 2,
    }
  };

  return (
    <Map
      id='UpSimulatorMaps'
      // @ts-ignore
      ref={mapRef}
      // initialViewState={{
      //   longitude: 106.660107,
      //   latitude: -6.311977,
      //   zoom: 14
      // }}
      // onMove={evt => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100%" }}
      mapStyle={import.meta.env.VITE_MAPLIBRE_MAPSTYLE}
    // mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    // mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json""
    >

      {isochroneData !== null && (
        <Source id="isochrone-source" type='geojson' data={isochroneData}>
          <Layer {...isochroneFillLayer} />
          <Layer {...isochroneLineLayer} />
        </Source>
      )}

      {upData !== null && props?.simulatorData?.update === true && (
        <Source id='up-source' type='geojson' data={upData}>
          <Layer {...upLayer} />
        </Source>
      )}

      {/* @ts-ignore */}
      {sekolahData?.features?.length > 0 && (
        <Source id='sekolah-source' type='geojson' data={sekolahData}>
          <Layer {...sekolahLayer} />
          <Layer {...sekolahTextLabelLayer} />
        </Source>
      )}

    </Map>
  )

  // function thecontent() {
  //   return (<div className='px-5'>{JSON.stringify(isochroneData)}</div>)
  // }

  // return (
  //   <div>
  //     {thecontent()}
  //   </div>
  // )
}