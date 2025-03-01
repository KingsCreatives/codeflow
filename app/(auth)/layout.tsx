import React, { ReactNode }  from 'react'


const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='flex-center min-h-full w-full'>
        {children}
    </main>
  )
}

export default layout