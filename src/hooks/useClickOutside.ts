import { useEffect } from 'react'

const useOutsideClick = (ref, callback) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}

export default useOutsideClick

// reference
// https://medium.com/@kevinfelisilda/click-outside-element-event-using-react-hooks-2c540814b661
