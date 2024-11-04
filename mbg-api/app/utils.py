import json
import requests
from settings import settings


def get_isochrone_valhalla(longitude: float, latitude: float, distance_km: float):
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
