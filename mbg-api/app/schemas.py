from typing import List
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


class UPCoverageResponse(BaseModel):
    isochrone: dict
    data_sekolah: List[Sekolah]
