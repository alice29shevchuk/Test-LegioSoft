import React, { useState, useMemo } from 'react';
import { useQuery, useMutation,useQueryClient } from 'react-query';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Input, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { useTable, useSortBy, usePagination, useFilters } from 'react-table';

const TransactionTable: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: transactions = [], refetch } = useQuery('transactions', () => fetchTransactions());

  // State for modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

  // Columns definition for the table
  const columns = useMemo(() => [
    {
      Header: 'ID',
      accessor: 'TransactionId',
    },
    {
      Header: 'Статус',
      accessor: 'Status',
    },
    {
      Header: 'Тип',
      accessor: 'Type',
    },
    {
      Header: 'Ім\'я клієнта',
      accessor: 'ClientName',
    },
    {
      Header: 'Сума',
      accessor: 'Amount',
    },
    {
      Header: 'Дії',
      Cell: ({ row }: any) => (
        <div>
          <Button onClick={() => handleEdit(row.original)}>Edit</Button>
          <Button onClick={() => handleDelete(row.original)}>Delete</Button>
        </div>
      ),
    },
  ], []);

  // React-table hooks for table functionality
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    prepareRow,
    setFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: transactions,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  // Handlers for filtering
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setFilter("ClientName", value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || "All";
    setFilter("Status", value !== "All" ? value : "");
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || "All";
    setFilter("Type", value !== "All" ? value : "");
  };

  // Simulated edit and delete handlers (replace with actual logic)
  const handleEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true); // Open the modal
  };

  const deleteTransactionMutation = useMutation(deleteTransaction, {
    onSuccess: (updatedTransactions) => {
      queryClient.setQueryData('transactions', updatedTransactions);
    },
  });

  // Simulated delete handler (replace with actual logic)
  const handleDelete = async (transaction: any) => {
    try {
      await deleteTransactionMutation.mutateAsync(transaction.TransactionId);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

//   const handleDelete = async (transaction: any) => {
//     // Implement delete logic here
//     console.log('Delete transaction:', transaction);
//     // Simulated deletion
//     const updatedTransactions = transactions.filter((item) => item.TransactionId !== transaction.TransactionId);
//     // Update the table after deletion
//     queryClient.setQueryData('transactions', updatedTransactions);
//     // Optionally, you can use a mutation here to handle deletion on the server
//   };

  // Modal close handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Modal submit handler (for updating transaction status)
  const handleUpdateTransaction = async () => {
    // Implement update logic here
    console.log('Updated transaction:', selectedTransaction);
    // Simulated update
    const updatedTransaction = { ...selectedTransaction }; // Simulated updated transaction
    // Update the table after editing
    const updatedTransactions = transactions.map((item) =>
      item.TransactionId === updatedTransaction.TransactionId ? updatedTransaction : item
    );
    queryClient.setQueryData('transactions', updatedTransactions);
    setIsModalOpen(false); // Close the modal after update
    // Optionally, you can use a mutation here to handle update on the server
  };

  // Function to fetch transactions (replace with actual data fetching logic)
  const fetchTransactions = async () => {
    // Simulated fetch
    return [
      { TransactionId: 1, Status: 'Pending', Type: 'Withdrawal', ClientName: 'John Doe', Amount: 100 },
      { TransactionId: 2, Status: 'Completed', Type: 'Refill', ClientName: 'Jane Smith', Amount: 200 },
      { TransactionId: 3, Status: 'Cancelled', Type: 'Withdrawal', ClientName: 'Alice Johnson', Amount: 150 },
    ];
  };



  async function deleteTransaction(transactionId: number) {
    // Simulated deletion
    const updatedTransactions = transactions.filter((item) => item.TransactionId !== transactionId);
    return updatedTransactions;
  }

  return (
    <>
      <Input
        onChange={handleFilterChange}
        placeholder={"Search by client name"}
        style={{
          marginBottom: "10px"
        }}
      />
      <Select placeholder="Select Status" onChange={handleStatusFilterChange}>
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </Select>
      <Select placeholder="Select Type" onChange={handleTypeFilterChange}>
        <option value="All">All</option>
        <option value="Withdrawal">Withdrawal</option>
        <option value="Refill">Refill</option>
      </Select>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      {/* Modal for editing transaction */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Place your form or input fields for editing here */}
            <p>Transaction ID: {selectedTransaction?.TransactionId}</p>
            <p>Status: {selectedTransaction?.Status}</p>
            <Select defaultValue={selectedTransaction?.Status} onChange={(e) => setSelectedTransaction({ ...selectedTransaction, Status: e.target.value })}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateTransaction}>
              Save
            </Button>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div>
        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </Button>
        <Button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </Button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {Math.ceil(transactions.length / pageSize)}
          </strong>{' '}
        </span>
      </div>
    </>
  );
};

export default TransactionTable;










