import Head from 'next/head'
import { Aside } from '@/components/Aside'

export function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Therapist</title>
      </Head>
      <div className='relative w-full min-h-screen bg-gptdarkgray'>
        <Aside />
        {children}
      </div>
    </>
  )
}
