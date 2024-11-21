import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  styled,
} from '@mui/material';

interface TradeData {
  date: string;
  shares: number;
  transaction_code: string;
  price_per_share: number;
}

interface DataTableProps {
  tradeData: TradeData[];
  rowsPerPage: number;
  page: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: 'rgba(115, 194, 160, 0.2)',
  color: '#FFFFFF',
  textAlign: 'center',
  padding: '16px',
  fontSize: '0.95rem',
  borderBottom: '1px solid rgba(115, 194, 160, 0.1)',
}));

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(115, 194, 160, 0.05)',
  },
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  '&:hover': {
    backgroundColor: 'rgba(115, 194, 160, 0.1)',
    transition: 'background-color 0.2s ease',
  },
});

const StyledTableBodyCell = styled(TableCell)({
  color: 'rgba(255, 255, 255, 0.8)',
  textAlign: 'center',
  padding: '16px',
  borderBottom: '1px solid rgba(115, 194, 160, 0.1)',
});

const StyledTableContainer = styled(TableContainer)({
  backgroundColor: 'transparent',
  '& .MuiTablePagination-root': {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  '& .MuiTablePagination-selectIcon': {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  '& .MuiTablePagination-select': {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  '& .MuiTablePagination-selectLabel': {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  '& .MuiTablePagination-displayedRows': {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  '& .MuiIconButton-root.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  '& .MuiIconButton-root': {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

const DataTable: React.FC<DataTableProps> = ({
  tradeData,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const paginatedData = tradeData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTransactionType = (code: string) => {
    const types: { [key: string]: string } = {
      P: 'Purchase',
      S: 'Sale',
      A: 'Grant',
      D: 'Sale to Loss',
      F: 'Payment of Exercise',
      I: 'Discretionary Transaction',
      M: 'Exercise/Conversion',
    };
    return types[code] || code;
  };

  return (
    <StyledTableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Transaction Type</StyledTableCell>
            <StyledTableCell>Shares</StyledTableCell>
            <StyledTableCell>Price Per Share</StyledTableCell>
            <StyledTableCell>Total Value</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableBodyCell>{formatDate(row.date)}</StyledTableBodyCell>
                <StyledTableBodyCell>
                  {getTransactionType(row.transaction_code)}
                </StyledTableBodyCell>
                <StyledTableBodyCell>
                  {row.shares.toLocaleString()}
                </StyledTableBodyCell>
                <StyledTableBodyCell>
                  ${typeof row.price_per_share === 'number' 
                    ? row.price_per_share.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : row.price_per_share}
                </StyledTableBodyCell>
                <StyledTableBodyCell>
                  ${(row.shares * Number(row.price_per_share)).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </StyledTableBodyCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableBodyCell colSpan={5}>
                No transaction data available.
              </StyledTableBodyCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={tradeData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </StyledTableContainer>
  );
};

export default DataTable;