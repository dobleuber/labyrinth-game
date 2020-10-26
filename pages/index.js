import Head from 'next/head'

import fs from 'fs'
import path from 'path'

import MapContainer from '../components/map-container'

import styles from '../styles/Home.module.css'

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Labyrinth Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h5 className={styles.title}>
          Welcome to labyrinth game!
        </h5>
        <div className={styles.gameContainer}>
          <div className={styles.canvasContainer}>
            <MapContainer {...props}/>
          </div>
          <div className={styles.instructions}>
            <p>Use arrows key to move the player</p>
            <p>Restart the game clicking the win or lose text</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps(context) {
  function setMap (mapData) {
    const lines = mapData.split('\n');
    const firstLine = lines.shift()
    const [nRows, nCols, steps] = firstLine.split(' ')
    const map = lines.reduce((r, l, i) => {
      const bricks = l.split('')
      for (let j = 0; j < bricks.length; j++) {
        r[j + '-' + i] = bricks[j]
      }

      return r
    }, {})

    return {
      lines, map, nRows, nCols, steps
    }
  }
  const mapsDirectory = path.join(process.cwd(), 'maps')
  const map = fs.readFileSync(`${mapsDirectory}/map-0.txt`, 'utf8')
  const mapData = setMap(map)

  return {
    props: {
      ...mapData
    }, // will be passed to the page component as props
  }
}
