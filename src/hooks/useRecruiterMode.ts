'use client'

import { useState, useEffect } from 'react'

export function useRecruiterMode() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('recruiterMode') === 'true'
    setEnabled(stored)
    document.documentElement.dataset.recruiter = String(stored)
  }, [])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    localStorage.setItem('recruiterMode', String(next))
    document.documentElement.dataset.recruiter = String(next)
  }

  return { enabled, toggle }
}
