'use client'

import { useConversationsStore } from '@/store/conversations'
import { MenuIcon, MessageIcon, PencilIcon, PlusIcon, TrashIcon } from './Icons'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useState } from 'react'

export function Aside() {
  const [editConversationId, setEditConversationId] = useState(null)

  const addNewConversation = useConversationsStore(
    (state) => state.addNewConversation
  )
  const conversationsInfo = useConversationsStore(
    (state) => state.conversationsInfo
  )
  const removeConversation = useConversationsStore(
    (state) => state.removeConversation
  )
  const clearConversations = useConversationsStore(
    (state) => state.clearConversations
  )
  const selectConversation = useConversationsStore(
    (state) => state.selectConversation
  )

  const [animationParent] = useAutoAnimate()

  return (
    <>
      <div className='sticky top-0 z-10 flex items-center pt-1 pl-1 text-slate-800 bg-white border-b border-gray-200 sm:pl-3 md:hidden'>
        <button
          type='button'
          className='-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-300'
        >
          <span className='sr-only'>Abrir menú</span>
          <MenuIcon />
        </button>
        <h1 className='flex-1 text-base font-normal text-center'>Nueva conversación</h1>
        <button onClick={addNewConversation} type='button' className='px-3'>
          <PlusIcon />
        </button>
      </div>
      <aside className='fixed z-10 flex flex-col w-64 min-h-screen transition -translate-x-full md:transition-none lg:translate-x-0 bg-gptgray'>
        <nav className='flex flex-col flex-1 h-full p-2 space-y-1'>
          <button onClick={addNewConversation} className='flex items-center flex-shrink-0 gap-3 px-3 py-3 mb-2 text-sm text-slate-800 transition-colors duration-200 border rounded-md cursor-pointer hover:bg-gray-100 border-gray-200'>
            <PlusIcon />
            Nueva conversación
          </button>

          <div className='flex-col flex-1 overflow-y-auto border-b border-gray-200'>
            <div
              ref={animationParent}
              className='flex flex-col gap-2 text-sm text-slate-800'
            >
              {Object.entries(conversationsInfo).map(
                ([key, conversationInfo]) => {
                  const isEditing = editConversationId === key
                  const Element = isEditing ? 'a' : 'div'
                  const ElementText = isEditing ? 'input' : 'div'

                  return (
                    <Element
                      key={key}
                      onClick={() => selectConversation({ id: key })}
                      className='relative flex items-center gap-3 px-3 py-3 break-all bg-white rounded-md cursor-pointer pr-14 hover:bg-gray-50 group'
                    >
                      <MessageIcon />
                      <ElementText className='relative flex-1 overflow-hidden break-words max-h-5 text-slate-800'>
                        {conversationInfo.name}
                        <div className='absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white' />
                      </ElementText>

                      <div className='absolute z-10 flex visible text-slate-500 right-1'>
                        <button onClick={() => setEditConversationId(key)} className='p-1 hover:text-slate-800'>
                          <PencilIcon />
                        </button>

                        <button
                          onClick={() => removeConversation({ id: key })}
                          className='p-1 hover:text-slate-800'
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </Element>
                  )
                }
              )}
            </div>
          </div>
          <button
            onClick={clearConversations}
            className='flex items-center gap-3 px-3 py-3 text-sm text-slate-800 transition-colors duration-200 rounded-md cursor-pointer hover:bg-gray-100'
          >
            <TrashIcon />
            Borrar conversaciones
          </button>
        </nav>
      </aside>
    </>
  )
}
