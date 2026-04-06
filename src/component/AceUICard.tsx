import React from 'react'

type AceUICardProps = {
    children: React.ReactNode;
}


function AceUICard({children}: AceUICardProps) {
  return (
    <div className='rounded-xl p-4 shadow-sm bg-white'>
        {children}
    </div>
  )
}

export default AceUICard