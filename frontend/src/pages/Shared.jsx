import React, { useContext, useState } from 'react'
import { ProjectCard } from '../components/ProjectCard'
import { AuthContext } from '../context/AuthContext'
import { useProject } from '../hooks/useProject'
import { CardSkeleton } from '../utils/PageLoader'

export default function Shared() {
  const user = useContext(AuthContext)
  const { projects, loading } = useProject()
  const collabCount = projects?.[0]?.collaborators?.length + 1 || 0
  const num = 5
  return (
    <> 
      <div className='relative bg-bg-primary font-sans text-slate-200 space-y-6'>
        <div className="space-y-2">
          <h2 className='text-3xl font-bold font-mono'>Shared Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
            loading ? Array.from({ length: num }).map((_, i) => (
              <CardSkeleton key={i} />
            )) :
              user &&
              projects?.filter(project => project.owner === user.user._id).map((project, index) => (
                <ProjectCard key={index} collabCount={collabCount} {...project} />
              ))
          }
        </div>
      </div>
    </>
  )
}
