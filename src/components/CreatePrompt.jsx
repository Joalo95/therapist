import { SendIcon } from '@/components/Icons.jsx'
import { useEffect, useRef, useState } from 'react'
import { useConversationsStore } from '@/store/conversations'

const loadingStates = [
  [true, false, false],
  [true, true, false],
  [true, true, true]
]

function LoadingButton() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex(prevIndex => {
        const newIndex = prevIndex + 1
        return newIndex > 2 ? 0 : newIndex
      })
    }, 400)

    return () => clearInterval(intervalId)
  }, [])

  const [, showSecond, showThird] = loadingStates[index]

  return (
    <div className='text-2xl'>
      <span className=''>·</span>
      <span className={`${!showSecond && 'invisible'}`}>·</span>
      <span className={`${!showThird && 'invisible'}`}>·</span>
    </div>
  )
}

export function ChatForm() {
  const sendPrompt = useConversationsStore((state) => state.sendPrompt)
  const isLoading = useConversationsStore(state => state.loading)
  const textAreaRef = useRef()

  const handleSubmit = (event) => {
    event?.preventDefault()
    if (isLoading) return

    const { value } = textAreaRef.current
    sendPrompt({ prompt: value })
    textAreaRef.current.value = ''
    // reset height to single line after sending
    try {
      textAreaRef.current.style.height = '24px'
    } catch (e) { }
  }

  const handleChange = () => {
    const el = textAreaRef.current
    if (!el) return
    el.style.height = '24px'
    const scrollHeight = el.scrollHeight
    const newH = Math.max(scrollHeight, 24)
    el.style.height = newH + 'px'
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  useEffect(() => {
    if (textAreaRef.current) {
      // ensure initial height is correct
      handleChange()
      textAreaRef.current.focus()
    }
  }, [])

  return (
    <section className='fixed bottom-0 left-0 right-0 w-full px-2 border-t lg:ml-32 md:border-t-0 dark:border-white/20 md:border-transparent bg-gradient'>
      <form
        disabled={isLoading}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className='flex flex-row max-w-3xl pt-6 m-auto mb-2'
      >
        <div className='relative flex flex-col flex-grow w-full px-4 py-3 text-slate-800 border rounded-md shadow-lg bg-white border-gray-200'>
          <textarea
            onChange={handleChange}
            ref={textAreaRef}
            rows={1}
            tabIndex={0}
            autoFocus
            defaultValue=''
            style={{ height: '24px', overflow: 'hidden' }}
            className='w-full resize-none bg-transparent m-0 border-0 outline-none text-slate-800 placeholder-gray-400'
          />
          <button
            disabled={isLoading}
            type='submit'
            className={`opacity-40 absolute p-1 rounded-md bottom-0 h-full right-2.5 ${isLoading ? 'pointer-events-none' : 'hover:shadow-2xl rounded-full'}`}
          >
            {
              isLoading ? <LoadingButton /> : <SendIcon />
            }
          </button>
        </div>
      </form>
      <div className='px-3 pt-2 pb-3 text-xs text-center text-slate-600 md:px-4 md:pt-3 md:pb-6'>
        Este servicio es un asistente virtual con fines informativos y educativos. No reemplaza la atención profesional. Para situaciones de crisis, contacta a los servicios de emergencia o una línea de ayuda local.
      </div>
    </section>
  )
}
