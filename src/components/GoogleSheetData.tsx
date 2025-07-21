
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { downloadCSV } from '../lib/utils';
import { API_BASE } from '../lib/apiConfig';
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE,
});


const GoogleSheetData = () => {
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/sheet-data');
        setSheetData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sheet data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = () => {
    downloadCSV(sheetData, 'sheet-data.csv');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Sheet Data</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Button onClick={handleDownload} disabled={sheetData.length === 0}>
              Download CSV
            </Button>
            <Table>
              <TableHeader>
                <TableRow>
                  {sheetData.length > 0 &&
                    Object.keys(sheetData[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sheetData.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, i) => (
                      <TableCell key={i}>{String(value)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleSheetData; 