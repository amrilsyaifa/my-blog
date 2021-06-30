import { useState, useEffect } from 'react'

function TypingEffect({ text, delay, loop }) {
  const [textState, setTextState] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  useEffect(() => {
    if (currentIndex < text.length) {
      setTimeout(() => {
        setTextState(textState + text[currentIndex])
        setCurrentIndex(currentIndex + 1)
      }, delay)
    } else if (loop) {
      // reset the text and the index
      setTextState('')
      setCurrentIndex(0)
    }
  }, [currentIndex])
  return { text: textState }
}

export default TypingEffect
