import React from 'react';
import { Box } from '@chakra-ui/react';
import ImportButton from '../components/ImportButton';
import ExportButton from '../components/ExportButton';
import TransactionTable from '../components/TransactionTable';

const TransactionsPage: React.FC = () => {
  return (
    <Box p={4}>
      <Box mb={4}>
        <ImportButton />
        <ExportButton />
      </Box>
      <TransactionTable />
    </Box>
  );
};

export default TransactionsPage;
