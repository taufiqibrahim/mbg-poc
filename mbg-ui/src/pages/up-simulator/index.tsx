import axios from 'axios'
import * as XLSX from 'xlsx'
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
import { Button } from '@/components/custom/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { IconFileSpreadsheet } from '@tabler/icons-react'


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

  const handleExportExcel = () => {
    console.log("handleExportExcel")
    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(simulatorOutput.data_sekolah);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Trigger the download
    XLSX.writeFile(wb, "data.xlsx");
  }

  return (

    <Layout fixed>
      <div className="w-full h-screen grid grid-cols-[max-content_auto] grid-rows">

        {/* Left */}
        <div className="min-w-40 max-w-40 lg:max-w-80 h-auto overflow-hidden border-r-2 border-r-muted">
          <div className='sticky top-0 z-20 -mx-4 bg-background px-4 pb-3'>
            <div className='flex items-center justify-between py-2'>
              <div className='flex gap-2'>
                <h1 className='text-2xl font-bold px-3'>Simulator Lokasi UP</h1>
              </div>
            </div>
          </div>
          <div className='pl-4 mx-3 overflow-auto'>
            <UpSimulatorForm simulatorInput={{ ...simulatorInput }} handleFormSubmit={handleFormSubmit} handleFormUpdate={handleFormUpdate} loading={loading} />
          </div>
        </div>

        {/* Right */}
        <ResizablePanelGroup direction="vertical" className='h-full' onLayout={handleResizableOnLayout}>

          {/* Maps */}
          <ResizablePanel>
            <UpSimulatorMaps simulatorInput={{ ...simulatorInput }} simulatorOutput={{ ...simulatorOutput }} onMarkerDragEnd={onMarkerDragEnd} />
          </ResizablePanel>

          {/* Data */}
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>

            <div className='flex flex-col lg:flex-row h-full pt-2'>
              {/* Summary */}
              <div className='min-w-fit lg:w-2/12 flex-shrink-0 px-4  border-r-2 border-r-muted' style={{ fontSize: '120%' }}>
                <div className='pt-4'>
                  <CardTitle>{summaryStats.totalPD}</CardTitle>
                  <CardDescription>Peserta didik</CardDescription>
                </div>
                <div className='pt-4'>
                  <CardTitle>{summaryStats.totalSekolah}</CardTitle>
                  <CardDescription>Sekolah</CardDescription>
                </div>
              </div>

              {/* Table */}
              <ScrollArea className='lg:w-full lg:pr-4 flex-grow p-2'>
                <div className='flex flex-row flex-grow justify-between'>
                  <div className='px-4 align-middle'>Data Sekolah</div>
                  <div className='px-4'>
                    {
                      (simulatorOutput.data_sekolah.length > 0) ? (
                        <Button variant={'link'} size={'sm'} onClick={handleExportExcel} style={{ color: 'green' }} disabled={simulatorOutput.data_sekolah.length === 0}>
                          <IconFileSpreadsheet /> Unduh Excel
                        </Button>
                      ) : ("")
                    }
                  </div>
                </div>
                <div className='pt-0 px-2'>
                  <DataTable2 columns={sekolahColumns} data={simulatorOutput.data_sekolah} />
                </div>
              </ScrollArea>

            </div>

          </ResizablePanel>
        </ResizablePanelGroup>

      </div>
    </Layout>
  )
}