import {useState, useEffect} from 'react'

import debounce from 'lodash.debounce'

import ButtonStatus, {gameStatus} from './game-status'

import styles from './Components.module.css'

const MAP_SIZE = 600

const MapContainer = ({lines, map, nRows, nCols, steps}) => {
  const [position, setPosition] = useState([-1, -1, -1])
  const [status, setStatus] = useState(gameStatus.playing)

  const clearGame = () => {
    for (let r = 0; r < nCols; r++) {
      const bricks = lines[r].split('')
      for (let c = 0; c < nRows; c++) {
        const mapType = bricks[c]
        if (mapType === 's') {
          setPosition([r, c, +steps])
          return
        }
      }
    }
  }

  // get start position
  useEffect(() => {
    clearGame()
  }, [])

  const keysPressedHandler = debounce(function(event) {
    let key = event.code

    setPosition(oldPos => {
      let [newX, newY, moveCount] = oldPos
      switch (key) {
        case 'ArrowRight':
          newX++
          break
        case 'ArrowLeft':
          newX--
          break
        case 'ArrowUp':
          newY--
          break
        case 'ArrowDown':
          newY++
          break
      }

      if (map[newX + '-' + newY] === 'x') {
        return oldPos
      }

      if(moveCount > 0) {
        moveCount--
      }

      return [newX, newY, moveCount]
    })
  }, 500)

  useEffect(() => {
    window.addEventListener("keydown", keysPressedHandler, true)
    return () => {
      window.removeEventListener('keydown', keysPressedHandler)
    }
  }, [])

  useEffect(() => {
    const [posX, posY, moveCount] = position
    if (map[posX + '-' + posY] === 'f' && status !== gameStatus.lose) {
      setStatus(gameStatus.win)
    } else if (moveCount === 0) {
      setStatus(gameStatus.lose)
    }
  }, [position, setPosition])

  const types = {
    x: 'brick',
    s: 'start',
    f: 'finish',
  }

  const [posX, posY, moveCount] = position

  const max = nRows > nCols ? nRows : nCols
  const size = MAP_SIZE / max
  const playerSize = (size * 0.8) / 2
  const playerX = posX * size + (size / 2)
  const playerY = posY * size + (size / 2)

  function createNewGame() {
    clearGame()
    setStatus(gameStatus.playing)
  }

  function buildMap() {
    const mapParts = []
    for (let r = 0; r < nCols; r++) {
      const bricks = lines[r].split('')
      const y = size * r
      for (let c = 0; c < nRows; c++) {
        const mapType = bricks[c]
        if (mapType === ' ') { continue }
        const brickStyle = types[mapType]
        const x = c * size
        mapParts.push(
          <rect
            key={`${r}-${c}`}
            x={x}
            y={y}
            rx={5}
            ry={5}
            width={size - 1}
            height={size - 1}
            className={styles[brickStyle]}
          />
        )
      }
    }

    return mapParts
  }
  return (
    <svg className={styles.svg} width={MAP_SIZE} height={MAP_SIZE + 50}>
      {
        buildMap()
      }
      <ellipse cx={playerX} cy={playerY} rx={playerSize} ry={playerSize} fill="#0ff" />
      <text fill="#888" fontSize="32" fontFamily="Verdana" x="10" y={MAP_SIZE + 40}>Moves left: {moveCount}</text>
      <ButtonStatus
        status={status}
        x={MAP_SIZE / 2}
        y={MAP_SIZE + 40}
        onClick={createNewGame}
      />
    </svg>
  )
}


export default MapContainer
