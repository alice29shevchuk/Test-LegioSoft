import React, { useState } from 'react';
import { Button, Checkbox, CheckboxGroup, Stack, Select } from '@chakra-ui/react';
import { CSVLink } from 'react-csv';
import { useQuery } from 'react-query';

const ExportButton: React.FC = () => {
  const { data: transactions = [] } = useQuery('transactions', () => []);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['TransactionId', 'Status', 'Type', 'ClientName', 'Amount']);
  const [transactionType, setTransactionType] = useState<string>('All');
  const [transactionStatus, setTransactionStatus] = useState<string>('All');

  const columns = [
    { label: 'TransactionId', key: 'TransactionId' },
    { label: 'Status', key: 'Status' },
    { label: 'Type', key: 'Type' },
    { label: 'ClientName', key: 'ClientName' },
    { label: 'Amount', key: 'Amount' },
  ];

  const handleColumnChange = (checkedValues: string[]) => {
    setSelectedColumns(checkedValues);
  };

  const filteredTransactions = transactions.filter((transaction: any) => {
    return (transactionType === 'All' || transaction.Type === transactionType) &&
           (transactionStatus === 'All' || transaction.Status === transactionStatus);
  });

  const selectedColumnsData = filteredTransactions.map((transaction: any) => {
    const selectedData: any = {};
    selectedColumns.forEach((col) => {
      selectedData[col] = transaction[col];
    });
    return selectedData;
  });

  return (
    <>
      <Select placeholder="Select Type" onChange={(e) => setTransactionType(e.target.value)}>
        <option value="All">All</option>
        <option value="Withdrawal">Withdrawal</option>
        <option value="Refill">Refill</option>
      </Select>
      <Select placeholder="Select Status" onChange={(e) => setTransactionStatus(e.target.value)}>
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </Select>
      <CheckboxGroup value={selectedColumns} onChange={handleColumnChange}>
        <Stack spacing={5} direction="row">
          {columns.map((col) => (
            <Checkbox key={col.key} value={col.key}>
              {col.label}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
      <CSVLink data={selectedColumnsData} headers={columns.filter(col => selectedColumns.includes(col.key))} filename="transactions.csv">
        <Button>Експорт</Button>
      </CSVLink>
    </>
  );
};

export default ExportButton;
