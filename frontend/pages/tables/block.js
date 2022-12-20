import Link from 'next/link';
import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import styles from '../../styles/Home.module.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function date(unixTimestamp) {
  var date = new Date(unixTimestamp * 1000);
  let day = date.toLocaleDateString('en-US').toString();
  let time = date.toLocaleTimeString('en-US').toString();
  return day.concat(' ', time);
}

function Block({ data, time }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className='container flex justify-center'>
          <h1>Blocks</h1>
        </div>

        {/* {data.map((Block) => {
          return (
            <h3 key={Block.blockid}>
              <Link href={`/block/${Block.blockid}`}>ID: {Block.blockid},</Link>
              Timestamp: {Block.timestamp}, Reward: {Block.blockreward},
              <Link href={`/wallet/${Block.mineraddress}`}>
                Miner: {Block.mineraddress}
              </Link>
            </h3>
          );
        })} */}
        <div className='container flex justify-center'>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size='small'
              aria-label='a dense table'
            >
              <TableHead>
                <TableRow>
                  <TableCell>Block ID</TableCell>
                  <TableCell align='right'>Timestamp</TableCell>
                  <TableCell align='right'>Reward</TableCell>
                  <TableCell align='right'>Miner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((Block) => (
                  <TableRow
                    key={Block.blockid}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      <Link
                        className={styles.Link}
                        href={`/block/${Block.blockid}`}
                      >
                        {Block.blockid}
                      </Link>
                    </TableCell>
                    <TableCell align='right'>{Block.time}</TableCell>
                    <TableCell align='right'>{Block.blockreward}</TableCell>
                    <TableCell align='right'>
                      <Link
                        className={styles.Link}
                        href={`/wallet/${Block.mineraddress}`}
                      >
                        {Block.mineraddress}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>
    </div>
  );
}

export default Block;

export async function getServerSideProps() {
  const { data, error } = await supabase.from('block').select('*');
  const newData = (data) =>
    data.map((item) => {
      var time = date(item.timestamp);
      return { ...item, time };
    });

  return {
    props: {
      data: newData(data),
    },
  };
}
