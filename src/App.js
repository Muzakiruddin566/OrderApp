import React, { useCallback, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [orderAmount, setOrderAmount] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [venueDate, setVenueDate] = useState(null);
  const [orderDateTime , setOrderDateTime] = useState(null);
  const [loading , setLoading] = useState(false);

  const handleCreateOrder = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/orders/all`);
        const data = await response.json();
        console.log({data});
        setOrders(data.orders)
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [loading]);

  

  
  
 

  const handleDateAndTime = (setState)=>(value) => {
    setState(value)
  }



  const handleOrderSubmit =  () => {
    
      if (!orderAmount || !orderDateTime) {
          console.error('Order amount and order date/time are required.');
          return;
      }
      
      
      fetch(`${process.env.REACT_APP_BASE_URL}/orders/add`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              orderAmount: orderAmount,
              orderDateTime: orderDateTime
          })
      })
      .then(async response => {
          if (response.ok) {
              alert('Order submitted successfully.');
              setLoading(!loading);
              setShowModal(false);
          } else {
            const data = 
              await response.json();
              console.error('Failed to submit order.');
              alert(data.error);
          }
      })
      .catch(error => {
          console.error('Error submitting order:', error);
      });

  
    setShowModal(false);
  };
  
  const handleOnUpdate = () => {
        if (startTime && endTime && venueDate) {
     
      fetch(`${process.env.REACT_APP_BASE_URL}/venue/dateTime`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`
        },
        body: JSON.stringify({
          startTime: startTime,
          endTime: endTime,
          venueDate: venueDate
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update venue time');
        }
        return response.json();
      })
      .then(data => {
        alert("Update successful");
        console.log('Update successful:', data);
      })
      .catch(error => {
        console.error('Error updating venue time:', error.message);
      });
    } else {
      console.error('Validation failed: startTime, endTime, or venueDate is empty or null');
    }
  };
  

  return (
    <Container className="container py-5">
      <Row className="mb-4">
        <Col className="text-center">
          <h1>Order Management System</h1>
        </Col>
      </Row>
      <Row>
        <Col md={2} sm={12}>
          <Col className=" mt-2">
            <Button variant="primary" className='w-auto py-3 mb-3' onClick={handleCreateOrder}>Create Order</Button>
          </Col>
        </Col>
        <Col md={10} sm={12} className=''>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker label="Select venue Date"  value={dayjs(venueDate)} onChange={(newDate) => handleDateAndTime(setVenueDate)(moment(newDate?.$d).format('YYYY-MM-DD'))} />
              <TimePicker
                label="Venue Start Time "
                value={dayjs(startTime)} onChange={(newTime) => handleDateAndTime(setStartTime)(moment(newTime?.$d).format("HH:mm"))}
              />
              <TimePicker
                label="Venue end Time"
                value={dayjs(endTime)} onChange={(newTime) => handleDateAndTime(setEndTime)(moment(newTime?.$d).format("HH:mm"))}
              />
                <Button variant="primary" className='w-auto' onClick={handleOnUpdate}>Update venue</Button>
            </DemoContainer>
          </LocalizationProvider>
        </Col>

      </Row>
      <Row>
        <h1>All orders</h1>
        <Col lg={12} sm={12}>
        {
          orders?.length > 0 ?
          <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell align="right">OrderID</TableCell>
            <TableCell align="right">Order Amount</TableCell>
            <TableCell align="right">Order Date</TableCell>
            <TableCell align="right">Order Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row, index) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {index+1}
              </TableCell>
              <TableCell align="right">{row.orderId}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{moment(row.dateTime).format("MM/DD/YYYY")}</TableCell>
              <TableCell align="right">{moment(row.dateTime).format("HH:mm")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer> : 
      <p>No Orders Right Now</p>
        }
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="orderAmount">
              <Form.Label>Order Amount</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter order amount"
                value={orderAmount}
                onChange={(e) => handleDateAndTime(setOrderAmount)(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="orderDateTime">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Form.Label>Start Date and Time</Form.Label>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker label="Order date time picker" value={dayjs(orderDateTime)} onChange={(newDate) => handleDateAndTime(setOrderDateTime)(moment(newDate?.$d).format('YYYY-MM-DD HH:mm'))} />
                </DemoContainer>
              </LocalizationProvider>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleOrderSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default App;
