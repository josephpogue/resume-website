'use client'

import { useState, useEffect } from 'react'

export function useProfileMode() {
  // Default to career mode (true); only switch to player if explicitly stored as 'false'
  const [careerMode, setCareerMode] = useState(true)

  useEffect(() => {
    const isCareer = localStorage.getItem('profileMode') !== 'false'
    setCareerMode(isCareer)
    document.documentElement.dataset.career = String(isCareer)
  }, [])

  function toggle() {
    const next = !careerMode
    setCareerMode(next)
    localStorage.setItem('profileMode', String(next))
    document.documentElement.dataset.career = String(next)
  }

  return { careerMode, toggle }
}
