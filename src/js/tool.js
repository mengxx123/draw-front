function random (max, min) {
  if (typeof max !== 'number') {
    return Math.random()
  } else if (typeof min !== 'number') {
    min = 0
  }
  return Math.random() * (max - min) + min
}

function clamp (val, min, max) {
  return Math.min(max, Math.max(min, val))
}

export { random, clamp }
