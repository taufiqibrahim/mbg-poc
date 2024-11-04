import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'

export default function Dashboard() {
    return (
        <Layout>
            <Layout.Header>
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            <Layout.Body>
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
                    <div className='flex items-center space-x-2'>
                        <Button>Button 1</Button>
                    </div>
                </div>
                Tole
            </Layout.Body>
        </Layout>
    )
}