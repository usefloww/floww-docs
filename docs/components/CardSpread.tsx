import React from "react"
import { motion } from "framer-motion"

export default function CardSpread({
  children,
  gap = 48,
  maxTilt = 10,
  cardWidth = 360,
  className = "",
  cardClassName = "",
}) {
  const items = React.Children.toArray(children)
  const count = items.length
  if (count === 0) return null

  const mid = (count - 1) / 2

  return (
    <div
      className={`relative w-full flex items-center justify-center overflow-visible ${className}`}
    >
      <div
        className="relative overflow-visible"
        style={{
          width: cardWidth + (count - 1) * gap + gap * 2,
        }}
      >
        {items.map((child, i) => {
          const t = count === 1 ? 0 : (i - mid) / mid
          const x = (i - mid) * gap
          const rot = (maxTilt || 0) * t

          return (
            <motion.div
              key={i}
              className={
                "group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 " +
                "rounded-2xl overflow-visible " +
                cardClassName
              }
              style={{
                width: cardWidth,
                rotate: rot,
                x,
              }}
              whileHover={{ scale: 1.06, y: -8, zIndex: 50 }}
              whileTap={{ scale: 1.04, y: -4, zIndex: 50 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              <div className="relative h-auto w-full overflow-hidden rounded-2xl">
                {wrapMedia(child)}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function wrapMedia(node) {
  if (!React.isValidElement(node)) return node
  if (typeof node.type === "string" && node.type === "img") {
    return React.cloneElement(node, {
      className: merge("w-full h-auto object-contain select-none", node.props.className),
      draggable: false,
    })
  }
  return (
    <div className="h-auto w-full [contain:paint]">
      {React.cloneElement(node, {
        className: merge("w-full h-auto object-contain", node.props.className),
      })}
    </div>
  )
}

function merge(...classes) {
  return classes.filter(Boolean).join(" ")
}
