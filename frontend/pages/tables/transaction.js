import Link from 'next/link';
import * as React from 'react';
import supabase from '../../utils/supabase';
import styles from '../../styles/Home.module.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

function date(unixTimestamp) {
  var date = new Date(unixTimestamp * 1000);
  let day = date.toLocaleDateString('en-US').toString();
  let time = date.toLocaleTimeString('en-US').toString();
  return day.concat(' ', time);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
const headCells = [
  {
    id: 'transactionhash',
    numeric: false,
    disablePadding: false,
    label: 'Transaction Hash',
  },
  {
    id: 'transactionfee',
    numeric: true,
    disablePadding: false,
    label: 'Transaction Fee',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'gasused',
    numeric: true,
    disablePadding: false,
    label: 'Gas',
  },
  {
    id: 'blockid',
    numeric: true,
    disablePadding: false,
    label: 'Block',
  },
];
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
function Transaction({ data }) {
  const [pg, setpg] = React.useState(0);
  const [rpg, setrpg] = React.useState(5);

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('block');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function handleChangePage(event, newpage) {
    setpg(newpage);
  }

  function handleChangeRowsPerPage(event) {
    setrpg(parseInt(event.target.value, 10));
    setpg(0);
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Paper>
          <h1 style={{ textAlign: 'center', color: 'black' }}>Transactions</h1>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {stableSort(data, getComparator(order, orderBy))
                  .slice(pg * rpg, pg * rpg + rpg)
                  .map((Transaction, index) => {
                    return (
                      <TableRow
                        role='checkbox'
                        tabIndex={-1}
                        key={Transaction.transactionhash}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component='th' scope='row'>
                          <Link
                            className={styles.Link}
                            href={`/transaction/${Transaction.transactionhash}`}
                          >
                            {Transaction.transactionhash}
                          </Link>
                        </TableCell>
                        <TableCell align='right'>
                          {Transaction.transactionfee}
                        </TableCell>
                        <TableCell align='right'>
                          {Transaction.status}
                        </TableCell>
                        <TableCell align='right'>
                          {Transaction.gasused}
                        </TableCell>
                        <TableCell align='right'>
                          <Link
                            className={styles.Link}
                            href={`/block/${Transaction.blockid}`}
                          >
                            {Transaction.blockid}
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={data.length}
            rowsPerPage={rpg}
            page={pg}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* {data.map((Transaction) => {
          return (
            <h3 key={Transaction.transactionhash}>
              <Link href={`/transaction/${Transaction.transactionhash}`}>
                Transaction Hash: {Transaction.transactionhash},
              </Link>
              Transaction Fee: {Transaction.transactionfee}, Status:
              {Transaction.status}, Gas: {Transaction.gasused},
              {Transaction.blockid}
            </h3>
          );
        })} */}
      </main>
    </div>
  );
}

export default Transaction;

export async function getServerSideProps() {
  const { data, error } = await supabase.from('transaction').select('*');

  return {
    props: {
      data: data,
    },
  };
}
