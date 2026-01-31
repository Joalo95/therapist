"use client"

import { ChatForm } from '@/components/CreatePrompt'
import { Layout } from '@/components/Layout'
import { Message } from '@/components/Message'
import dynamic from 'next/dynamic'
const Welcome = dynamic(() => import('@/components/Welcome'), { ssr: false })
import { useConversationsStore } from '@/store/conversations.js'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useRef, useEffect } from 'react'

function Chat() {
  const selectedConversation = useConversationsStore(
    (state) => state.selectedConversation
  )
  const messages = useConversationsStore((state) => {
    const { selectedConversation } = state
    return state.conversationsMessages[selectedConversation]
  })
  const [animationParent] = useAutoAnimate()
  const messagesRef = useRef(null)

  useEffect(() => {
    try {
      const el = messagesRef.current
      if (!el) return
      // jump to bottom when messages change (works during streaming)
      el.scrollTop = el.scrollHeight
    } catch (e) {
      console.error('Scroll to bottom error', e)
    }
  }, [messages, selectedConversation])

  const renderContent = () => {
    if (!selectedConversation) return <Welcome />
    return (
      <div className='flex-1 overflow-hidden'>
        <div ref={messagesRef} className='h-full overflow-auto'>
          {messages?.map((entry) => (
            <Message key={entry.id} {...entry} />
          ))}
          <div className='flex-shrink-0 w-full h-32 md:h-48 bg-gptgray' />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col flex-1 h-full lg:pl-64'>
      <main className='relative w-full' ref={animationParent}>
        {renderContent()}
        <ChatForm />
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <Layout>
      <Chat />
    </Layout>
  )
}
