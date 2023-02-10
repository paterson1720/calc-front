import { useState, useEffect, useCallback } from 'react';
import MaterialReactTable from 'material-react-table';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

import { Box, IconButton } from '@mui/material';
import Protected from './Protected';
import { useUser } from '../contexts/user-context';
import axios from 'axios';

const columns = [
  {
    accessorKey: 'operation.label',
    header: 'Operation type',
  },
  {
    accessorKey: 'operation.cost',
    header: 'Operation cost',
  },
  {
    accessorKey: 'operation_response.result',
    header: 'Operation result',
  },
];

const Records = () => {
  const { user } = useUser();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const getData = useCallback(async () => {
    if (!user.authToken) return;
    const url = `${process.env.REACT_APP_API_BASE_URL}/records?page=${pagination.pageIndex}&limit=${pagination.pageSize}`;
    try {
      setIsLoading(true);
      const response = await axios.get(url, { headers: { Authorization: user.authToken } });
      setIsLoading(false);
      setRecords(response.data.records);
      setPaginationData(response.data.pagination);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [pagination, user.authToken]);

  const handleDelete = (row) => {
    const recordId = row.original._id;
    const url = `${process.env.REACT_APP_API_BASE_URL}/record/${recordId}`;
    axios
      .delete(url, { headers: { Authorization: user.authToken } })
      .then(() => getData())
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Protected>
      <Box sx={{ p: 8 }}>
        <MaterialReactTable
          columns={columns}
          data={records}
          getRowId={(row) => row._id}
          manualPagination
          enableRowSelection
          onPaginationChange={setPagination}
          rowCount={paginationData.totalDocuments}
          state={{ pagination, isLoading }}
          enableRowActions
          positionActionsColumn="last"
          renderRowActions={({ row }) => (
            <Box>
              <IconButton onClick={() => handleDelete(row)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        />
      </Box>
    </Protected>
  );
};

export default Records;
