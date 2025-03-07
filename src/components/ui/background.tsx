"use client"

import React from "react"
import { motion } from "framer-motion"
import { type ReactNode, useState, useEffect } from "react"

function FloatingPaths() {
  const [, setPathCount] = useState(0)
  const [paths, setPaths] = useState<Array<{id: number, d: string, width: number, delay: number, duration: number}>>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const handleResize = () => {
      const count = window.innerWidth < 768 ? 10 : 15
      setPathCount(count)
      
      // Generate paths on client-side only
      const newPaths = Array.from({ length: count }, (_, i) => {
        const side1 = Math.floor(Math.random() * 4)
        const side2 = (side1 + 2) % 4
        const getPoint = (side: number): { x: number; y: number } => {
          switch (side) {
            case 0:
              return { x: Math.random() * 600 - 300, y: -300 }
            case 1:
              return { x: 300, y: Math.random() * 600 - 300 }
            case 2:
              return { x: Math.random() * 600 - 300, y: 300 }
            case 3:
              return { x: -300, y: Math.random() * 600 - 300 }
            default:
              return { x: 0, y: 0 }
          }
        }
        const start = getPoint(side1)
        const end = getPoint(side2)
        const controlPoint = {
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 400,
        }
        const d = `M${start.x} ${start.y} Q${controlPoint.x} ${controlPoint.y} ${end.x} ${end.y}`
        
        return {
          id: i,
          d,
          width: 0.5 + Math.random() * 0.5,
          delay: i * 0.7 + Math.random() * 2,
          duration: 10 + Math.random() * 10,
        }
      })
      
      setPaths(newPaths)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!isClient) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950/25 dark:text-white/20"
        viewBox="-300 -300 600 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + Math.random() * 0.2}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: path.duration,
              delay: path.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// Optimized PremiumParticles function to avoid hydration errors
function PremiumParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number,
    x: number,
    y: number,
    size: number,
    depth: number,
    isStar: boolean
  }>>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const handleResize = () => {
      const count = window.innerWidth < 768 ? 40 : window.innerWidth < 1024 ? 60 : 80
      
      // Generate particles on client-side only
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        depth: Math.random(),
        isStar: Math.random() > 0.3, // 70% chance of being a star
      }))
      
      setParticles(newParticles)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!isClient) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${
            particle.isStar
              ? "bg-white dark:bg-yellow-200"
              : particle.depth > 0.5
                ? "bg-gradient-to-r from-slate-400 to-slate-300 dark:from-slate-500 dark:to-slate-400"
                : "bg-slate-300 dark:bg-slate-600"
          }`}
          style={{
            width: particle.isStar ? particle.size * 0.8 : particle.size,
            height: particle.isStar ? particle.size * 0.8 : particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.isStar ? 0.8 : 0.3 * particle.depth,
            filter: particle.isStar ? "blur(0.5px)" : particle.depth > 0.7 ? "blur(0.5px)" : "none",
            borderRadius: particle.isStar ? "0" : "9999px",
            transform: particle.isStar ? "rotate(45deg)" : "none",
          }}
          initial={{
            scale: 1,
            opacity: particle.isStar ? 0.6 : 0.1 * particle.depth,
          }}
          animate={
            particle.isStar
              ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                }
              : {
                  y: [0, 25 * particle.depth, 0],
                  opacity: [0.1 * particle.depth, 0.4 * particle.depth, 0.1 * particle.depth],
                  scale: [1, particle.depth > 0.7 ? 1.2 : 1, 1],
                }
          }
          transition={{
            duration: particle.isStar ? 2 + Math.random() * 3 : 15 + (particle.id % 5) * 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: particle.isStar ? "easeInOut" : "linear",
            delay: particle.id * 0.01,
          }}
        />
      ))}
    </div>
  )
}

// Optimized PremiumGradientBackground function to avoid hydration errors
function PremiumGradientBackground() {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!isClient) {
    // Return a simple placeholder during server-side rendering
    return (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDJhMTggMTggMCAxIDAgMCAzNiAxOCAxOCAwIDAgMCAwLTM2eiIvPjwvZz48L3N2Zz4=')]  dark:opacity-30 opacity-10" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 opacity-95" />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDJhMTggMTggMCAxIDAgMCAzNiAxOCAxOCAwIDAgMCAwLTM2eiIvPjwvZz48L3N2Zz4=')]  dark:opacity-30 opacity-10" />

      <motion.div
        className="absolute rounded-full blur-3xl opacity-20 bg-gradient-to-r from-indigo-400 to-blue-300 dark:from-indigo-600 dark:to-blue-500"
        initial={{
          width: isMobile ? "50vw" : "35vw",
          height: isMobile ? "50vw" : "35vw",
          top: "15%",
          left: "10%",
          x: 0,
          y: 0,
          scale: 1,
        }}
        animate={{
          x: [0, isMobile ? 10 : 15, 0],
          y: [0, isMobile ? -10 : -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: isMobile ? 20 : 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.1,
        }}
      />

      <motion.div
        className="absolute rounded-full blur-3xl opacity-20 bg-gradient-to-r from-violet-400 to-purple-300 dark:from-violet-600 dark:to-purple-500"
        initial={{
          width: isMobile ? "40vw" : "30vw",
          height: isMobile ? "40vw" : "30vw",
          bottom: "15%",
          right: "10%",
          x: 0,
          y: 0,
          scale: 1,
        }}
        animate={{
          x: [0, isMobile ? -10 : -15, 0],
          y: [0, isMobile ? 10 : 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: isMobile ? 25 : 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />

      <motion.div
        className="absolute rounded-full blur-3xl opacity-10 bg-gradient-to-r from-amber-200 to-rose-200 dark:from-amber-400 dark:to-rose-400"
        initial={{
          width: isMobile ? "35vw" : "25vw",
          height: isMobile ? "35vw" : "25vw",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          scale: 1,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: isMobile ? 15 : 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
    </div>
  )
}

// Optimized BackgroundPaths function to avoid hydration errors
export const BackgroundPaths = React.memo(function BackgroundPaths({
  children,
  title,
  showTitle = false,
}: {
  children?: ReactNode
  title?: string
  showTitle?: boolean
}) {
  const words = title?.split(" ") || [""]
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      {/* Simple base background that works for SSR */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 opacity-95" />
      
      {/* Only render complex animations on the client */}
      {isClient && (
        <>
          <PremiumGradientBackground />
          <FloatingPaths />
          <PremiumParticles />
        </>
      )}

      <div className="relative z-10 container mx-auto px-4 md:px-6 w-full">
        {showTitle && title && isClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-tighter">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-2 md:mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * (isMobile ? 0.02 : 0.03),
                        type: "spring",
                        stiffness: isMobile ? 100 : 150,
                        damping: 25,
                      }}
                      className="inline-block text-transparent bg-clip-text 
                                          bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-700 
                                          dark:from-white dark:via-gray-200 dark:to-gray-300"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
          </motion.div>
        )}

        {/* If not client yet and we have a title, render a simpler version */}
        {showTitle && title && !isClient && (
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-tighter">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-2 md:mr-4 last:mr-0">
                  {word}
                </span>
              ))}
            </h1>
          </div>
        )}

        {children}
      </div>
    </div>
  )
})