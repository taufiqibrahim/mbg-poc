import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input'
import { useForm } from "react-hook-form";
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

const RANGE_DISTANCE_KM = [1, 10]
const DEFAULT_DISTANCE_KM = 5
const RANGE_LONGITUDE = [99.0, 142.0]
const RANGE_LATITUDE = [-11.0, 11.0]

const upSimulatorFormSchema = z.object({
  longitude: z.coerce.number().min(RANGE_LONGITUDE[0]).max(RANGE_LONGITUDE[1]),
  latitude: z.coerce.number().min(RANGE_LATITUDE[0]).max(RANGE_LATITUDE[1]),
  distance: z.number().min(RANGE_DISTANCE_KM[0]).max(RANGE_DISTANCE_KM[1]).default(DEFAULT_DISTANCE_KM),
})

type UpSimulatorFormValues = z.infer<typeof upSimulatorFormSchema>

export default function UpSimulatorForm(props: any) {
  const form = useForm<z.infer<typeof upSimulatorFormSchema>>({
    resolver: zodResolver(upSimulatorFormSchema),
    defaultValues: {
      longitude: 106.660107,
      latitude: -6.311977,
      distance: DEFAULT_DISTANCE_KM,
    },
  })

  function onSubmit(values: UpSimulatorFormValues) {
    // console.log("child", values)
    props.parentSubmitCallback(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='longitude'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input type="number" pattern="^\d*(\.\d{0,6})?$" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='latitude'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input type="number" pattern="^\d*(\.\d{0,6})?$" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='distance'
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Jarak: {value} km</FormLabel>
              <FormControl>
                <Slider
                  min={RANGE_DISTANCE_KM[0]}
                  max={RANGE_DISTANCE_KM[1]}
                  step={0.1}
                  defaultValue={[value]}
                  onValueChange={(vals) => {
                    onChange(vals[0]);
                  }}
                  onValueCommit={(vals) => {
                    console.log('onValueCommit', vals)
                    onChange(vals[0]);
                  }}
                  value={[form.getValues("distance")]}
                />
              </FormControl>
              <FormDescription>
                Jarak maksimum pelayanan UP.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {props.loading ? (
          <Button className='w-80' disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Memproses...
          </Button>
        ) : (
          // <button onClick={() => setLoading(true)}>Click Me</button>
          <Button className='w-80' type='submit'>Kalkulasi</Button>
        )}

      </form>
    </Form>
  )
}