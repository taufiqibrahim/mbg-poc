import axios from 'axios'
import { useEffect, useState } from 'react'

import { Layout } from '@/components/custom/layout'

import UpSimulatorMaps from './maps'
import UpSimulatorForm from './form'
import { SummaryStats, UpSimulatorInput, UpSimulatorOutput } from './types'

import { AppConfig } from '@/config/config'
import { useToast } from '@/hooks/use-toast'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { CardDescription, CardTitle } from '@/components/ui/card'
import { DataTable2, sekolahColumns } from './data-tables-2'


export default function Dashboard() {
  const VITE_BACKEND_SERVICE_BASE_URL = import.meta.env.VITE_BACKEND_SERVICE_BASE_URL
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [simulatorInput, setSimulatorInput] = useState<UpSimulatorInput>({
    longitude: AppConfig.common.initialViewState.longitude,
    latitude: AppConfig.common.initialViewState.latitude,
    distance: 5.0,
  })

  const [simulatorOutput, setSimulatorOutput] = useState<UpSimulatorOutput>({
    isochrone: null,
    data_sekolah: []
  })

  const [summaryStats, setSummaryStats] = useState<SummaryStats>({ totalSekolah: 0, totalPD: 0 })

  const handleFormUpdate = (values: any) => {
    console.log('handleFormUpdate', values)
    setSimulatorInput({ ...values })
  }

  const handleFormSubmit = (values: any) => {
    console.log("handleFormSubmit", values)

    setLoading(true)
    // call API
    const baseUrl = `${VITE_BACKEND_SERVICE_BASE_URL}/predict-up-coverage`
    axios.get(`${baseUrl}?longitude=${values.longitude}&latitude=${values.latitude}&distance_km=${values.distance}`)
      .then((res) => {
        console.log("Response", res.data)
        setSimulatorOutput({ ...res.data })
      })
      .catch((err) => {
        console.log("Error calling API", err)
        toast({
          variant: "destructive",
          title: "Ups! Sepertinya ada masalah",
          description: "Silakan coba kembali beberapa saat lagi.",
          // action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onMarkerDragEnd = (event: any) => {
    console.log("onMarkerDragEnd", event)
    setSimulatorInput({ ...simulatorInput, longitude: event.lng, latitude: event.lat })
  }

  const handleResizableOnLayout = (sizes: number[]) => {
    console.log('handleResizableOnLayout', sizes)
  }

  const updateSummaryStats = () => {
    console.log("updateSummaryStats")

    // Get total sekolah
    const totalSekolah = simulatorOutput.data_sekolah.length || 0
    // Get total PD
    const totalPD = simulatorOutput.data_sekolah.reduce((sum, item) => sum + item.pd, 0) || 0

    const newSummaryStats = { totalSekolah: totalSekolah, totalPD: totalPD }
    setSummaryStats({ ...newSummaryStats })
  }

  useEffect(() => {
    updateSummaryStats()
  }, [simulatorOutput])

  return (

    <Layout fixed>
      <div className="w-full h-screen grid grid-cols-[max-content_auto] grid-rows">

        {/* Left */}
        <div className="w-fit h-auto overflow-hidden border-r-2 border-r-muted">
          <div className='sticky top-0 z-20 -mx-4 bg-background px-4 pb-3'>
            <div className='flex items-center justify-between py-2'>
              <div className='flex gap-2'>
                <h1 className='text-2xl font-bold px-3'>Simulator Lokasi UP</h1>
              </div>
            </div>
          </div>
          <div className='mx-3 overflow-auto'>
            <UpSimulatorForm simulatorInput={{ ...simulatorInput }} handleFormSubmit={handleFormSubmit} handleFormUpdate={handleFormUpdate} loading={loading} />
          </div>
        </div>

        {/* Right */}
        <ResizablePanelGroup direction="vertical" onLayout={handleResizableOnLayout}>
          <ResizablePanel>
            <UpSimulatorMaps simulatorInput={{ ...simulatorInput }} simulatorOutput={{ ...simulatorOutput }} onMarkerDragEnd={onMarkerDragEnd} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>

            {/* Summary */}
            <div className='h-fit m-1 pt-2 columns-2'>
              <div className='p-4'>
                <CardTitle>{summaryStats.totalPD}</CardTitle>
                <CardDescription>Peserta didik</CardDescription>
              </div>
              <div className='p-4'>
                <CardTitle>{summaryStats.totalSekolah}</CardTitle>
                <CardDescription>Sekolah</CardDescription>
              </div>
            </div>

            {/* Table */}
            {/* <div className="py-1">
              <ScrollArea className='h-[200px] rounded-md p-2'>
                <DataTable columns={sekolahColumns} data={simulatorOutput.data_sekolah} />
              </ScrollArea>
            </div> */}

            <DataTable2 columns={sekolahColumns} data={simulatorOutput.data_sekolah} />

          </ResizablePanel>
        </ResizablePanelGroup>

      </div>
    </Layout>
  )
}