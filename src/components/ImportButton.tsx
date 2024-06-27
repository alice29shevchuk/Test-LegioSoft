import React, { useRef } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { parseCSV } from '../utils/csvUtils';

const ImportButton: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation(
    async (file: File) => {
      const data = await parseCSV(file);
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData('transactions', data);
        toast({
          title: 'Імпорт успішний',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: () => {
        toast({
          title: 'Помилка імпорту',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      importMutation.mutate(event.target.files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button onClick={() => inputRef.current?.click()}>
        Імпорт
      </Button>
    </>
  );
};

export default ImportButton;
