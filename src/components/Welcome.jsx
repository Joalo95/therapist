'use client'

import { SunIcon } from './Icons'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useConversationsStore } from '@/store/conversations'

const EXAMPLES = [
  '¿Qué te trae por aquí hoy y qué te gustaría trabajar en esta sesión?',
  '¿Desde cuándo has notado este malestar y cómo suele aparecer en tu día a día?',
  '¿Qué objetivos concretos te gustaría alcanzar con este acompañamiento?'
]

export default function Welcome() {
  const [animationParent] = useAutoAnimate()
  const sendPrompt = useConversationsStore(state => state.sendPrompt)

  return (
    <section
      ref={animationParent}
      className='flex justify-center items-start w-full m-auto'
    >
      <div className='w-full px-6 text-gray-800 md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col dark:text-gray-100'>
        <h1 className='text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-6 flex gap-2 items-center justify-center text-sky-800'>
          Asistente Terapéutico
        </h1>

        <p className='block max-w-lg m-auto mb-6 text-center align-middle text-slate-700'>
          Soy un asistente virtual diseñado para brindar escucha empática,
          apoyo emocional y herramientas prácticas basadas en la psicología.
          No sustituyo la atención profesional presencial, pero puedo ayudarte
          a explorar emociones, practicar técnicas y encontrar recursos.
        </p>

        <h3 className='flex items-center justify-center mt-6 mb-2 text-lg gap-x-2 text-sky-700'><SunIcon />En qué puedo acompañarte</h3>

        <p className='text-center text-sm text-slate-600 mb-4'>Puedo ofrecer: escucha activa, técnicas de regulación emocional, ejercicios breves y recursos recomendados.</p>

        <ul className='flex flex-col gap-3.5 w-full sm:max-w-md m-auto'>
          {
            EXAMPLES.map((example, index) => (
              <button key={index} onClick={() => sendPrompt({ prompt: example })} className='w-full py-2 px-3 text-sm rounded-md bg-sky-50 hover:bg-sky-100 text-sky-800 break-words'>
                {example} →
              </button>
            ))
          }
        </ul>

        <h4 className='mt-6 text-center text-sm font-medium text-slate-700'>Especializaciones</h4>
        <p className='text-center text-xs text-slate-600 mb-6'>Ansiedad · Depresión · Duelo · Estrés · Problemas de sueño · Relaciones</p>
      </div>
    </section>
  )
}
