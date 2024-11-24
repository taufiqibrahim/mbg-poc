import json
import requests
from settings import settings

from typing import List, Tuple

def _trans(value, index):
    """
    Copyright (c) 2014 Bruno M. Custódio
    Copyright (c) 2016 Frederick Jansen
    https://github.com/hicsail/polyline/commit/ddd12e85c53d394404952754e39c91f63a808656
    """
    byte, result, shift = None, 0, 0

    while byte is None or byte >= 0x20:
        byte = ord(value[index]) - 63
        index += 1
        result |= (byte & 0x1F) << shift
        shift += 5
        comp = result & 1

    return ~(result >> 1) if comp else (result >> 1), index

def _decode(expression, precision=5, order="lnglat", is3d=False):
    """
    Copyright (c) 2014 Bruno M. Custódio
    Copyright (c) 2016 Frederick Jansen
    https://github.com/hicsail/polyline/commit/ddd12e85c53d394404952754e39c91f63a808656

    Modified to be able to work with 3D polylines and a specified coordinate order.
    """
    coordinates, index, lat, lng, z, length, factor = (
        [],
        0,
        0,
        0,
        0,
        len(expression),
        float(10**precision),
    )

    while index < length:
        lat_change, index = _trans(expression, index)
        lng_change, index = _trans(expression, index)
        lat += lat_change
        lng += lng_change
        coord = (lat / factor, lng / factor) if order == "latlng" else (lng / factor, lat / factor)
        if not is3d:
            coordinates.append(coord)
        else:
            z_change, index = _trans(expression, index)
            z += z_change
            coordinates.append((*coord, z / 100))

    return coordinates

def decode_polyline(
    polyline: str, precision: int = 6, order: str = "lnglat"
) -> List[Tuple[float, float]]:
    """Decodes an encoded ``polyline`` string with ``precision`` to a list of coordinate tuples.
    The coordinate ``order`` of the output can be ``lnglat`` or ``latlng``."""

    return _decode(polyline, precision=precision, order=order, is3d=False)


def get_valhalla_isochrone(longitude: float, latitude: float, distance_km: float):
    url = settings.isochrone_service_url
    fix_speed_kph = 40
    top_speed_kph = 60
    time_minutes = (distance_km / fix_speed_kph) * 60
    request_payload = {
        "polygons": True,
        "denoise": 0.1,
        "generalize": 0,
        "show_locations": False,
        "costing": "auto",
        "costing_options": {
            "auto": {
                "costing": {
                    "maneuver_penalty": 5,
                    "country_crossing_penalty": 0,
                    "country_crossing_cost": 600,
                    "width": 1.6,
                    "height": 1.9,
                    "use_highways": 1,
                    "use_tolls": 1,
                    "use_ferry": 1,
                    "ferry_cost": 300,
                    "use_living_streets": 0.5,
                    "use_tracks": 0,
                    "private_access_penalty": 450,
                    "ignore_closures": False,
                    "ignore_restrictions": False,
                    "ignore_access": False,
                    "closure_factor": 9,
                    "service_penalty": 15,
                    "service_factor": 1,
                    "exclude_unpaved": 1,
                    "shortest": False,
                    "exclude_cash_only_tolls": False,
                    "top_speed": top_speed_kph,
                    "fixed_speed": fix_speed_kph,
                    "toll_booth_penalty": 0,
                    "toll_booth_cost": 15,
                    "gate_penalty": 300,
                    "gate_cost": 30,
                    "include_hov2": False,
                    "include_hov3": False,
                    "include_hot": False,
                    "disable_hierarchy_pruning": False
                },
                "directions": {
                    "alternates": 0,
                    "exclude_polygons": []
                }
            }
        },
        "contours": [
            {
                # "time": time_minutes
                "distance": distance_km,
            }
        ],
        "locations": [
            {
                "lon": longitude,
                "lat": latitude,
                "type": "break"
            }
        ],
        "units": "kilometers",
        "id": f"valhalla_isochrones_lonlat_{longitude},{latitude}_range_10_interval_10"
    }
    response = requests.get(url, json=request_payload)
    res = response.json()
    return res


def get_valhalla_optimized_route(start_location, destinations):
    url = settings.optimized_route_service_url
    url = "https://valhalla1.openstreetmap.de/optimized_route?"
    locations = []
    locations.append(start_location)
    locations += destinations
    locations.append(start_location)

    request_payload = {
        "locations": locations,
        "costing": "auto",
        "units": "kilometers",
        # "format": "osrm",
        "shape_format": "geojson",
        "voice_instructions": False,
        "directions_type": "none",
    }
    response = requests.get(url, json=request_payload)

    if response.status_code >= 400:
        print(response.text)
        return None
    res = response.json()
    return res


def parse_valhalla_optimized_route(response):
    legs = response.get('trip', {}).get('legs', [])
    _geojson = {
        "type": "FeatureCollection",
        "features": []
    }

    _features = []

    for i, leg in enumerate(legs):
        shape = leg['shape']
        pline = decode_polyline(shape)
        _features.append({
            "type": "Feature",
            "properties": {"id": i},
            "geometry": {
                "coordinates": pline,
                "type": "LineString",
            }
        })

    _geojson['features'] = _features
    return _geojson
