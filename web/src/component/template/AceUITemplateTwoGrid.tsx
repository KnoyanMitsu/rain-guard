import React from 'react'

type AceUITemplateTwoGridProps = {
  children: React.ReactNode
}



function AceUITemplateTwoGrid({ children }: AceUITemplateTwoGridProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className='grid grid-cols-5  h-screen'>
      <div className='col-span-2'>{childrenArray[0]}</div>
      <div className='col-span-3'>{childrenArray[1]}</div>
    </div>
  )
}

export default AceUITemplateTwoGrid