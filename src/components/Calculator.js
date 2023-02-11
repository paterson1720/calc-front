import { Alert, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/user-context';
import Protected from './Protected';

const boxStyles = {
  marginTop: 1,
  display: 'flex',
  flexDirection: 'column',
};

export default function Calculator() {
  const { user } = useUser();
  const [operations, setOperations] = useState([]);
  const [operation, setOperation] = useState({});
  const [requestData, setRequestData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleOperationChange = (e) => {
    const { value } = e.target;
    setResultData(null);
    setRequestData({});
    setOperation(operations[value]);
    if (value === 'random_string') {
      setRequestData({ upperalpha: true, loweralpha: true, length: 20 });
    } else {
      setRequestData({ values: [] });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { operationType: operation.type };
    if (operation.type === 'square_root') {
      const values = [Number(requestData.number)];
      data.values = values;
    }
    if (operation.type === 'random_string') {
      data.upperalpha = requestData.upperalpha;
      data.loweralpha = requestData.loweralpha;
      data.length = requestData.length;
    }
    if (!['random_string', 'square_root'].includes(operation.type)) {
      const values = [Number(requestData.firstNumber), Number(requestData.secondNumber)];
      data.values = values;
    }

    try {
      setError(null);
      setLoading(true);
      setResultData(null);
      const url = `${process.env.REACT_APP_API_BASE_URL}/operations/calculate`;
      const response = await axios.post(url, data, {
        headers: { Authorization: user.authToken },
      });
      setResultData(response.data);
      setRequestData({});
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error);
      console.error(error.response.data);
    }
  };

  const handleInputChange = (event) => {
    const strToBool = { Yes: true, No: false };
    const { name, value: inputValue } = event.target;
    const value = strToBool[inputValue] !== undefined ? strToBool[inputValue] : inputValue;
    setRequestData({ ...requestData, [name]: value });
  };

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/operations`;
        const response = await axios.get(url);
        const transformedOperations = response.data.operations.reduce((obj, item) => {
          const { type } = item;
          obj[type] = item;
          return obj;
        }, {});
        console.log(transformedOperations);
        setOperations(transformedOperations);
        setOperation(transformedOperations['addition']);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOperations();
  }, []);

  return (
    <Protected>
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h3" sx={{ mt: 8, textAlign: 'center' }}>
          Calculator
        </Typography>
        {loading && (
          <Box sx={{ display: 'grid', placeItems: 'center', width: '100%' }}>
            <CircularProgress />
          </Box>
        )}
        {resultData && (
          <Alert severity="success">
            <Typography component="h1" variant="h5" sx={{ mt: 1, textAlign: 'center' }}>
              Result: {resultData.result}
            </Typography>
            <Typography component="h1" variant="h5" sx={{ mt: 1, textAlign: 'center' }}>
              Remaining balance: ${resultData.remainingBalance}
            </Typography>
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit} id="calculator-form">
          <Box sx={boxStyles}>
            <Typography component="label">Select operation type</Typography>
            <select disabled={loading} value={operation.type} onChange={handleOperationChange}>
              {Object.values(operations).map((item) => (
                <option key={item.type} value={item.type}>
                  {item.label}
                </option>
              ))}
            </select>
          </Box>

          {!['square_root', 'random_string'].includes(operation.type) && (
            <>
              <Box sx={boxStyles}>
                <Typography component="label">First number</Typography>
                <input
                  name="firstNumber"
                  type="number"
                  onChange={handleInputChange}
                  value={requestData.firstNumber || ''}
                  required
                  disabled={loading}
                />
              </Box>
              <Box sx={boxStyles}>
                <Typography component="label">Second number</Typography>
                <input
                  name="secondNumber"
                  type="number"
                  onChange={handleInputChange}
                  value={requestData.secondNumber || ''}
                  required
                  disabled={loading}
                />
              </Box>
            </>
          )}

          {operation.type === 'square_root' && (
            <Box sx={boxStyles}>
              <Typography component="label">Number</Typography>
              <input
                name="number"
                type="number"
                onChange={handleInputChange}
                value={requestData.number || ''}
                required
                disabled={loading}
              />
            </Box>
          )}

          {operation.type === 'random_string' && (
            <div>
              <Box sx={boxStyles}>
                <Typography component="label">Include uppercase letters</Typography>
                <select
                  name="upperalpha"
                  disabled={loading}
                  value={requestData.upperalpha ? 'Yes' : 'No'}
                  onChange={handleInputChange}
                >
                  {['Yes', 'No'].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Box>
              <Box sx={boxStyles}>
                <Typography component="label">Include lowercase letters</Typography>
                <select
                  name="loweralpha"
                  disabled={loading}
                  value={requestData.loweralpha ? 'Yes' : 'No'}
                  onChange={handleInputChange}
                >
                  {['Yes', 'No'].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Box>
              <Box sx={boxStyles}>
                <Typography component="label">String length</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <input
                    type="range"
                    name="length"
                    value={requestData.length || ''}
                    step={1}
                    min={1}
                    max={20}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  <span>{requestData.length}</span>
                </Box>
              </Box>
            </div>
          )}

          <Alert severity="info" sx={{ mt: 2, textAlign: 'center' }}>
            <Typography>Operation cost: ${operation.cost} dollars</Typography>
          </Alert>

          <Button type="submit" disabled={loading} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {loading ? 'Calculating...' : `Calculate`}
          </Button>
        </form>
      </Container>
    </Protected>
  );
}
