import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import PageWithJSbasedForm from '../utils/search';

export default function Home() {

  return (
    <div className={styles.container}>
      <main className={styles.home}>
        
        <h1 className={styles.title}>
        blockchain scanner
        </h1>
        <div className={styles.grid}>
        <p className={styles.description}>
          Search for wallet address, block id, or transaction hash here:&nbsp;
        </p>
        <PageWithJSbasedForm/></div>
        <div className={styles.grid}>
        <p className={styles.description}>
          Check for data here:
        </p>
        </div>
        <div className={styles.grid}>
          <Link href="/tables/wallet" className={styles.card}>
            <h2>Wallets &rarr;</h2>
            <p>Check the miners</p>
          </Link> 

          <a href="/tables/block" className={styles.card}>
            <h2>Blocks &rarr;</h2>
            <p>Check the blocks</p>
          </a>

          <a
            href="/tables/transaction"
            className={styles.card}
          >
            <h2>Transactions &rarr;</h2>
            <p>Check history transactions</p>
          </a>

        </div>
      </main>

      <footer className={styles.footer}>
        <p>Implemented by: Shichang Ke, Jiarui Chen</p>
      </footer>
    </div>
  )
}
