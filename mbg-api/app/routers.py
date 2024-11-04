import json
from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text

from schemas import UPCoverageQueryParams, UPCoverageResponse
from database import get_db
from utils import get_isochrone_valhalla


router = APIRouter()


@router.get('/predict-up-coverage', response_model=UPCoverageResponse)
def predict_up_coverage(params: Annotated[UPCoverageQueryParams, Query()], db: Session = Depends(get_db)):
    isochrone = get_isochrone_valhalla(longitude=params.longitude,
                                       latitude=params.latitude,
                                       distance_km=params.distance_km)

    isochrone_geojson = json.dumps(isochrone["features"][0]["geometry"])

    sql = f"""SELECT npsn, name, longitude, latitude, pd,
        induk_kecamatan, kode_wilayah_induk_kecamatan, induk_kabupaten, kode_wilayah_induk_kabupaten, induk_provinsi, kode_wilayah_induk_provinsi,
        bentuk_pendidikan, status_sekolah
    FROM sekolah
    WHERE ST_INTERSECTS(geometry, ST_GeomFromGeoJSON('{isochrone_geojson}'))
    ORDER BY npsn
    """
    db_result = db.execute(text(sql))

    result = {
        "isochrone": isochrone,
        "data_sekolah": db_result,
    }

    return result
