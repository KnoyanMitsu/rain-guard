import React from 'react'

type Props = {
    children: React.ReactNode
}

function AceUITemplateBlankWithContainerCenter({ children }: Props) {
  return (
    <div className='flex items-center justify-center h-screen'>
        <div className='w-full container'>
            {children}
        </div>
    </div>
  )
}

export default AceUITemplateBlankWithContainerCenter