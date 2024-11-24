import json
from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text

from schemas import UPCoverageQueryParams, UPCoverageResponse
from database import get_db
from utils import get_valhalla_isochrone, get_valhalla_optimized_route, parse_valhalla_optimized_route


router = APIRouter()


@router.get('/predict-up-coverage', response_model=UPCoverageResponse)
def predict_up_coverage(params: Annotated[UPCoverageQueryParams, Query()], db: Session = Depends(get_db)):
    isochrone = get_valhalla_isochrone(longitude=params.longitude,
                                       latitude=params.latitude,
                                       distance_km=params.distance_km)

    isochrone_geojson = json.dumps(isochrone["features"][0]["geometry"])

    # Get sekolah data
    sql = f"""SELECT npsn, nama AS name, longitude, latitude, pd, bentuk_pendidikan, status_sekolah
    FROM sekolah_v2
    WHERE ST_INTERSECTS(geometry, ST_GeomFromGeoJSON('{isochrone_geojson}'))
    ORDER BY npsn
    """
    db_result = db.execute(text(sql))
    data_sekolah = [row._asdict() for row in db_result]

    # Get route if required
    routes = None
    if params.include_route:
        # print("Getting routing...")
        start_location = {"lat": params.latitude, "lon": params.longitude}
        destinations = [{"lat": ds['latitude'], "lon": ds['longitude']} for ds in data_sekolah]
        valhalla_routes = get_valhalla_optimized_route(start_location=start_location, destinations=destinations)
        if valhalla_routes is not None:
            routes = parse_valhalla_optimized_route(response=valhalla_routes)

    result = {
        "isochrone": isochrone,
        "data_sekolah": data_sekolah,
        "routes": routes
    }

    return result
