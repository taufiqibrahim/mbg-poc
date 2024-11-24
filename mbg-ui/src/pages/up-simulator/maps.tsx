import { Map, Layer, Source, Marker } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import type { FeatureCollection } from 'geojson'
import { useEffect, useRef, useState } from "react"
import bbox from '@turf/bbox'
// import { AppConfig } from '@/config/config'
import Pin from '@/components/maps/pin'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Sekolah, UpSimulatorMapsProps } from './types'
import { isochroneFillLayer, isochroneLineLayer, routeDirectionSymbolLayer, routeLayer, sekolahLayer, sekolahTextLabelLayer } from './layers'

export default function UpSimulatorMaps(props: UpSimulatorMapsProps) {

  const { simulatorInput, simulatorOutput, onMarkerDragEnd } = props;
  const [marker, setMarker] = useState({ longitude: simulatorInput.longitude, latitude: simulatorInput.latitude })
  const [isochroneData, setIsochroneData] = useState(null)
  const [sekolahData, setSekolahData] = useState<FeatureCollection>()
  const [routeData, setRouteData] = useState<FeatureCollection>()
  const mapRef = useRef<MapRef>()


  const convertToPointFeatures = (locations: Sekolah[]) => {
    console.log("convertToPointFeatures", locations)
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
    // console.log(simulatorInput)
    // setMarker location if changes coming from Form
    setMarker({ ...marker, longitude: simulatorInput.longitude, latitude: simulatorInput.latitude })
  }, [simulatorInput])

  useEffect(() => {
    console.log("Maps", simulatorOutput)
    // Check props.simulatorData
    if (simulatorOutput?.isochrone) {

      // Set UP geojson
      const features = convertToPointFeatures(simulatorOutput.data_sekolah);

      // @ts-ignore
      setSekolahData({
        type: 'FeatureCollection',
        // @ts-ignore
        features: features
      });
      console.log('sekolahData', sekolahData)

      // Get isochrone geojson
      const isochrone = simulatorOutput.isochrone.features[0]

      // Check if isochrone available
      console.log("check isochroner", isochrone)
      if (isochrone !== null) {
        setIsochroneData(isochrone)
        
        // Fitbound to isochrone
        const [minLng, minLat, maxLng, maxLat] = bbox(isochrone)

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

      // Add route data
      setRouteData(simulatorOutput.routes)

    } else {
      console.log("no data")
    }

  }, [simulatorOutput])

  const _onDragEnd = (e: any) => {
    onMarkerDragEnd(e.lngLat)
  }

  return (
    <Map
      id='UpSimulatorMaps'
      // @ts-ignore
      ref={mapRef}
      initialViewState={{
        longitude: simulatorInput.longitude,
        latitude: simulatorInput.latitude,
        zoom: 14
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={import.meta.env.VITE_MAPLIBRE_MAPSTYLE}

    >
      <Marker longitude={marker.longitude} latitude={marker.latitude} draggable onDragEnd={_onDragEnd}>
        <Pin size={20} />
      </Marker>

      {isochroneData !== null && (
        <Source id="isochrone-source" type='geojson' data={isochroneData}>
          <Layer {...isochroneFillLayer} />
          <Layer {...isochroneLineLayer} />
        </Source>
      )}

      {/* @ts-ignore */}
      {sekolahData?.features?.length > 0 && (
        <Source id='sekolah-source' type='geojson' data={sekolahData}>
          <Layer {...sekolahLayer} />
          <Layer {...sekolahTextLabelLayer} />
        </Source>
      )}

      {/* @ts-ignore */}
      {routeData?.features?.length > 0 && (
        <Source id='route-source' type='geojson' data={routeData}>
          <Layer {...routeLayer} />
          <Layer {...routeDirectionSymbolLayer} />
        </Source>
      )}

    </Map>
  )

}