import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import TransactionsPage from './pages/TransactionsPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <TransactionsPage />
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;
