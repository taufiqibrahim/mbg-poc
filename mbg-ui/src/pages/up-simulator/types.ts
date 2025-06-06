export interface UpSimulatorInput {
  longitude: number
  latitude: number
  distance: number
  includeRoute: boolean
}

export interface UpSimulatorOutput {
  isochrone: any
  data_sekolah: Sekolah[]
  routes: any
}

export interface Sekolah {
  npsn: string;
  name: string;
  pd: number;
  bentuk_pendidikan: string;
  status_sekolah: string;
  longitude: number;
  latitude: number;
}

export interface SummaryStats {
  totalSekolah: number
  totalPD: number
}

export interface UpData {
  type: string;
  geometry: any;
}

export interface UpSimulatorMapsProps {
  simulatorInput: UpSimulatorInput
  simulatorOutput: UpSimulatorOutput
  onMarkerDragEnd: (lngLat: { lng: number; lat: number }) => void
}

export interface UpSimulatorFormProps {
  simulatorInput: UpSimulatorInput
  loading: boolean
  handleFormSubmit: (e: any) => void
  handleFormUpdate: (e: any) => void
}
