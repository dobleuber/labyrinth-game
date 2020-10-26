import styles from './Components.module.css'

const gameStatus = {
  playing: 0,
  lose: 1,
  win: 2
}

export default function ButtonStatus({status, x, y, onClick}) {
  switch (status) {
    case gameStatus.playing:
      return null;
    case gameStatus.lose:
      return (
        <text
          fill="#c00"
          fontSize="32"
          fontFamily="Verdana"
          x={x}
          y={y}
          onClick={onClick}
          className={styles.gameStatus}
        >
          You Lose!
        </text>
      )
    case gameStatus.win:
      return (
        <text
          fill="#080"
          fontSize="32"
          fontFamily="Verdana"
          x={x}
          y={y}
          onClick={onClick}
          className={styles.gameStatus}
        >
          You won!
        </text>
      )
  }
}

export {gameStatus}
