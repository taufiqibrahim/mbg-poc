from typing import List, Union
from pydantic import BaseModel, Field


class Sekolah(BaseModel):
    npsn: str
    name: str
    pd: int
    bentuk_pendidikan: str
    status_sekolah: str
    longitude: float = None
    latitude: float = None


class UPCoverageQueryParams(BaseModel):
    longitude: float
    latitude: float
    distance_km: float = Field(5, gte=1, le=10)
    include_route: bool


class UPCoverageResponse(BaseModel):
    isochrone: dict
    data_sekolah: List[Sekolah]
    routes: Union[dict, None] = None
