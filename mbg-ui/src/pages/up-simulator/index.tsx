import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'

// import UpSimulatorMaps from './maps'
import UpSimulatorMaps from './up-simulator-maps'

import { cn } from '@/lib/utils'
import UpSimulatorForm from './up-simulator-form'

import axios from 'axios'
import { useState } from 'react'

export default function Dashboard() {
  const VITE_BACKEND_SERVICE_BASE_URL = import.meta.env.VITE_BACKEND_SERVICE_BASE_URL
  const [loading, setLoading] = useState(false)
  const [simulatorData, setSimulatorData] = useState({
    update: false,
    longitude: 0,
    latitude: 0,
    zoom: 14,
  })

  function handleSubmit(values: any) {
    setLoading(true)
    console.log("Form submitted", values)

    // call API
    const baseUrl = `${VITE_BACKEND_SERVICE_BASE_URL}/predict-up-coverage`
    axios.get(`${baseUrl}?longitude=${values.longitude}&latitude=${values.latitude}&distance_km=${values.distance}`)
      .then((res) => {
        console.log("Response", res.data)
        setSimulatorData({...res.data, update: true, longitude: values.longitude, latitude: values.latitude})
      })
      .catch((err) => {
        console.log("Error calling API", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Layout fixed>
      <Layout.Header>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body className='sm:overflow-hidden py-0'>
        <section className='flex h-full gap-6'>

          {/* Left Side */}
          <div className='flex w-full flex-col gap-2 sm:w-80 lg:w-80 2xl:w-80'>
            <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
              <div className='flex items-center justify-between py-2'>
                <div className='flex gap-2'>
                  <h1 className='text-2xl font-bold'>Simulator Lokasi UP</h1>
                </div>
              </div>
            </div>

            <div className='-mx-3 h-full overflow-auto p-3'>
              <UpSimulatorForm parentSubmitCallback={handleSubmit} loading={loading} />
            </div>
          </div>

          {/* Right Side */}
          <div
            className={cn(
              'absolute inset-0 left-full z-50 flex w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex', true && 'left-0'
            )}
          >
            {/* <div> */}
            <UpSimulatorMaps simulatorData={{...simulatorData}} />
            {/* </div> */}
            {/* <div>Tole</div> */}
          </div>

        </section>
      </Layout.Body>
    </Layout>
  )
}