"use client"

import { useState } from "react"
import Image from "next/image"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"

const colors = [
  { name: "Rouge", hex: "#EF4444", angle: 0 },
  { name: "Jaune", hex: "#FBBF24", angle: 51.43 },
  { name: "Bleu", hex: "#3B82F6", angle: 102.86 },
  { name: "Vert", hex: "#10B981", angle: 154.29 },
  { name: "Orange", hex: "#F97316", angle: 205.71 },
  { name: "Violet", hex: "#8B5CF6", angle: 257.14 },
  { name: "Rose", hex: "#EC4899", angle: 308.57 },
]

export default function ColorWheel() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<null | (typeof colors)[number]>(null)
  const [isChestOpen, setIsChestOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  const [history, setHistory] = useState<Array<(typeof colors)[number]>>([])
  const [isResultOpen, setIsResultOpen] = useState(false)

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setWinner(null)
    setIsChestOpen(false)
    setHighlightIndex(null)
    setIsResultOpen(false)

    const spins = 4 + Math.random() * 2
    const randomDegree = Math.random() * 360
    const totalRotation = spins * 360 + randomDegree

    const newRotation = rotation + totalRotation
    setRotation(newRotation)

    setTimeout(() => {
      const finalAngle = newRotation % 360
      const segmentSize = 360 / colors.length
      const arrowPosition = 90
      const segmentAtArrow = (arrowPosition - finalAngle + 360) % 360
      const winnerIndex = Math.floor(segmentAtArrow / segmentSize) % colors.length

      const won = colors[winnerIndex]
      setWinner(won)
      setHighlightIndex(winnerIndex)
      setIsSpinning(false)
      setHistory((prev) => [won, ...prev].slice(0, 6))
      setTimeout(() => {
        setIsChestOpen(true)
        setIsResultOpen(true)
      }, 300)
    }, 4000)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 max-w-2xl mx-auto">

      {/* Wheel Container (click to spin) */}
      <div
        className="relative flex items-center justify-center cursor-pointer select-none pb-56 md:pb-56"
        role="button"
        tabIndex={0}
        aria-disabled={isSpinning}
        onClick={spinWheel}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            spinWheel()
          }
        }}
        title={isSpinning ? "En rotation..." : "Appuyez sur la roue pour jouer"}
        aria-label={isSpinning ? "En rotation..." : "Appuyez sur la roue pour jouer"}
        style={{ touchAction: "manipulation" }}
      >
  {/* Wheel */}
  <div className="relative w-[400px] h-[400px]">
          <svg
            width="400"
            height="400"
            viewBox="0 0 460 460"
            className="drop-shadow-2xl transition-transform duration-200 will-change-transform"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
            }}
          >
            <defs>
              <filter id="winGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="rimOuterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1B3C30" />
                <stop offset="30%" stopColor="#1B3C30" />
                <stop offset="70%" stopColor="#1B3C30" />
                <stop offset="100%" stopColor="#1B3C30" />
              </linearGradient>

              <linearGradient id="rimInnerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1B3C30" />
                <stop offset="50%" stopColor="#1B3C30" />
                <stop offset="100%" stopColor="#1B3C30" />
              </linearGradient>

              <radialGradient id="rimShadowOnSegments">
                <stop offset="85%" stopColor="transparent" />
                <stop offset="92%" stopColor="rgba(0,0,0,0.3)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
              </radialGradient>
            </defs>

            <circle cx="230" cy="230" r="210" fill="none" stroke="#8B7500" strokeWidth="6" opacity="0.3" />

            <circle cx="230" cy="230" r="205" fill="none" stroke="url(#rimOuterGradient)" strokeWidth="22" />

            <circle
              cx="230"
              cy="230"
              r="205"
              fill="none"
              stroke="#FFED4E"
              strokeWidth="5"
              opacity="0.9"
              strokeDasharray="12 6"
            />

            <circle cx="230" cy="230" r="195" fill="none" stroke="url(#rimInnerGradient)" strokeWidth="10" />

            <circle cx="230" cy="230" r="188" fill="none" stroke="#B8860B" strokeWidth="4" opacity="0.7" />

            {colors.map((color, index) => {
              const startAngle = (index * 360) / colors.length - 90
              const endAngle = ((index + 1) * 360) / colors.length - 90
              const startRad = (startAngle * Math.PI) / 180
              const endRad = (endAngle * Math.PI) / 180

              const x1 = 230 + 180 * Math.cos(startRad)
              const y1 = 230 + 180 * Math.sin(startRad)
              const x2 = 230 + 180 * Math.cos(endRad)
              const y2 = 230 + 180 * Math.sin(endRad)

              return (
                <path
                  key={color.name}
                  d={`M 230 230 L ${x1} ${y1} A 180 180 0 0 1 ${x2} ${y2} Z`}
                  fill={color.hex}
                  stroke={highlightIndex === index && !isSpinning ? "#FFF" : "white"}
                  strokeWidth={highlightIndex === index && !isSpinning ? 6 : 3}
                  filter={highlightIndex === index && !isSpinning ? "url(#winGlow)" : undefined}
                />
              )
            })}

            <circle cx="230" cy="230" r="180" fill="url(#rimShadowOnSegments)" />

            <circle cx="230" cy="230" r="40" fill="#1F2937" stroke="#FFD700" strokeWidth="3" />

            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180
              const x = 230 + 60 * Math.cos(rad)
              const y = 230 + 60 * Math.sin(rad)
              return <circle key={angle} cx={x} cy={y} r="4" fill="#FFD700" />
            })}
          </svg>
          {/* Arrow Indicator (stays on top, positioned relative to the wheel) */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 z-20">
            <div className="relative">
              <svg width="40" height="60" viewBox="0 0 40 60">
                <path
                  d="M 0 30 L 40 10 L 40 50 Z"
                  fill="#EF4444"
                  stroke="#DC2626"
                  strokeWidth="2"
                  filter="drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Chest overlay above the wheel (z-index), goes behind when modal opens */}
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center ${
            isResultOpen ? "z-0" : "z-10"
          }`}
        >
          <div
            className={`relative w-80 h-80 translate-y-30 md:translate-y-30 ${
              isResultOpen ? "opacity-70" : "opacity-100"
            }`}
          >
            <Image
              src="/coffres.png"
              alt="Coffre au trésor"
              fill
              sizes="192px"
              className={`drop-shadow-2xl object-contain select-none transition-transform duration-700 ${
                isChestOpen ? "scale-105" : "scale-100"
              }`}
              priority={false}
            />
            {winner && isChestOpen && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 animate-bounce"
                style={{ animation: "bounce 1s ease-in-out 2" }}
              >
                <div
                  className="px-8 py-4 rounded-2xl shadow-2xl text-center min-w-[250px] border-4 border-white"
                  style={{ backgroundColor: winner.hex }}
                >
                  <p className="text-2xl font-bold text-white drop-shadow-lg">🎉 {winner.name} ! 🎉</p>
                </div>
              </div>
            )}
          </div>
          
        </div>
        
        
      </div>
       {/* Click hint (optional) */}
      <div className="text-black/90 text-lg font-semibold ">
        {isSpinning ? "En rotation..." : "Appuyez sur la roue pour jouer"}
      </div>

     



      {/* Result popup */}
      <Dialog.Root open={isResultOpen} onOpenChange={setIsResultOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-white/90 p-6 shadow-2xl backdrop-blur-md z-[120]">
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                {winner ? `Résultat: ${winner.name}` : "Résultat"}
              </Dialog.Title>
              <Dialog.Close className="rounded-full p-2 text-gray-700 hover:bg-black/5">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
            {winner && (
              <div className="mt-4 flex items-center gap-3">
                <span
                  className="inline-block h-6 w-6 rounded-full border border-black/20 shadow"
                  style={{ backgroundColor: winner.hex }}
                />
                <span className="text-base font-medium text-gray-800">Vous avez gagné {winner.name} !</span>
              </div>
            )}
            <div className="mt-6 flex items-center justify-end gap-3">
              <Dialog.Close className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50">
                Fermer
              </Dialog.Close>
              <button
                type="button"
                onClick={() => {
                  setIsResultOpen(false)
                  setTimeout(() => spinWheel(), 100)
                }}
                className="rounded-md bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow hover:brightness-105"
              >
                Rejouer
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
