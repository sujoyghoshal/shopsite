import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import axios from 'axios';
import SalesCard from '../components/SalesCard';
import SalesChart from '../components/SalesChart';

const SellerHomePage = () => {
  const [ongoingOrders, setOngoingOrders] = useState(0);
  const [addedToCartCount, setAddedToCartCount] = useState(0);
  const customerId = '66ec015dfc1a82a943bb54b8'; 

  useEffect(() => {
    // Fetch the ongoing orders count
    const fetchOngoingOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getTotalOrderCount`);
        setOngoingOrders(response.data.totalOrders);
      } catch (error) {
        console.error('Error fetching ongoing orders:', error);
      }
    };

    // Fetch the added to cart count
    const fetchAddedToCartCount = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getCartCount/${customerId}`);
        setAddedToCartCount(response.data.totalCartCount);
      } catch (error) {
        console.error('Error fetching added to cart count:', error);
      }
    };

    fetchOngoingOrders();
    fetchAddedToCartCount();
  }, [customerId]);

  return (
    <Grid container spacing={3} sx={{ padding: "9px" }}>
      <Grid item xs={12} sm={6} md={3}>
        <SalesCard title="Weekly Sales" total={ongoingOrders} color='primary' icon={'ant-design:carry-out-filled'} />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SalesCard title="Added to Cart" total={addedToCartCount} color="success" icon={'ant-design:shopping-cart-outlined'} />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SalesCard title="Ongoing Orders" total={ongoingOrders} color="warning" icon={'material-symbols:data-exploration'} />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SalesCard title="Cancelled Orders" total={13} color="error" icon={'material-symbols:free-cancellation-rounded'} />
      </Grid>

      <Grid item xs={12} lg={6}>
        <SalesChart type="line" />
      </Grid>

      <Grid item xs={12} lg={6}>
        <SalesChart type="bar" />
      </Grid>
    </Grid>
  );
};

export default SellerHomePage;
