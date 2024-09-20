import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Box, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../components/Popup';
import { fetchProductDetailsFromCart, removeAllFromCart, removeSpecificProduct } from '../../../redux/userSlice';

const PaymentForm = ({ handleBack }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { status, currentUser, productDetailsCart } = useSelector(state => state.user);

    const params = useParams();
    const productID = params.id;

    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [paymentData, setPaymentData] = useState({
        cardName: '',
        cardNumber: '',
        expDate: '',
        cvv: '',
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setPaymentData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [popupColor, setPopupColor] = useState("success"); // Default to green color

    useEffect(() => {
        if (productID) {
            dispatch(fetchProductDetailsFromCart(productID));
        }
    }, [productID, dispatch]);

    const productsQuantity = currentUser.cartDetails.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = currentUser.cartDetails.reduce((total, item) => total + (item.quantity * item.price.cost), 0);

    const singleProductQuantity = productDetailsCart && productDetailsCart.quantity;
    const totalsingleProductPrice = productDetailsCart && productDetailsCart.price && productDetailsCart.price.cost * productDetailsCart.quantity;

    const paymentID = `${paymentData.cardNumber.slice(-4)}-${paymentData.expDate.slice(0, 2)}${paymentData.expDate.slice(-2)}-${Date.now()}`;
    const paymentInfo = paymentMethod === 'Credit Card' 
        ? { id: paymentID, status: "Successful" } 
        : { id: `COD-${Date.now()}`, status: "Successful" }; 

    const multiOrderData = {
        buyer: currentUser._id,
        shippingData: currentUser.shippingData,
        orderedProducts: currentUser.cartDetails,
        paymentInfo,
        productsQuantity,
        totalPrice,
    };

    const singleOrderData = {
        buyer: currentUser._id,
        shippingData: currentUser.shippingData,
        orderedProducts: productDetailsCart,
        paymentInfo,
        productsQuantity: singleProductQuantity,
        totalPrice: totalsingleProductPrice,
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (paymentMethod === 'Credit Card') {
            // Simulate successful card payment
            if (paymentData.cardNumber.replace(/\s+/g, '') === '4242424242424242') {
                setMessage("Order Successful!");
                setPopupColor("success"); // Always green
                if (productID) {
                    dispatch(addStuff("newOrder", singleOrderData));
                    dispatch(removeSpecificProduct(productID));
                } else {
                    dispatch(addStuff("newOrder", multiOrderData));
                    dispatch(removeAllFromCart());
                }
            } else {
                // Still show success popup (green) for failed card payment simulation
                setMessage("Card Payment Simulation Successful!");
                setPopupColor("success"); // Always green
                setShowPopup(true);
                return; // Stop further execution for failed payment simulation
            }
        } else {
            // Handle Cash on Delivery
            setMessage("Order Successful!");
            setPopupColor("success"); // Always green
            if (productID) {
                dispatch(addStuff("newOrder", singleOrderData));
                dispatch(removeSpecificProduct(productID));
            } else {
                dispatch(addStuff("newOrder", multiOrderData));
                dispatch(removeAllFromCart());
            }
            setShowPopup(true); // Show popup after setting the message and color
        }
    };

    useEffect(() => {
        if (status === 'added') {
            setMessage("Order Successful!");
            setPopupColor("success"); // Always green
            setShowPopup(true);
            setTimeout(() => {
                navigate('/Aftermath');
            }, 2000);
        } else if (status === 'failed') {
            setMessage("Order Failed");
            // Always show success popup (green)
            setPopupColor("success"); 
            setShowPopup(true);
        } else if (status === 'error') {
            setMessage("Network Error");
            // Always show success popup (green)
            setPopupColor("success"); 
            setShowPopup(true);
        }
    }, [status, navigate]);

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <FormControl component="fieldset">
                <FormLabel component="legend">Select Payment Method</FormLabel>
                <RadioGroup
                    aria-label="paymentMethod"
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                >
                    <FormControlLabel value="Credit Card" control={<Radio />} label="Credit Card" />
                    <FormControlLabel value="Cash on Delivery" control={<Radio />} label="Cash on Delivery" />
                </RadioGroup>
            </FormControl>

            {paymentMethod === 'Credit Card' && (
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="cardName"
                                label="Name on card"
                                fullWidth
                                autoComplete="cc-name"
                                variant="standard"
                                value={paymentData.cardName}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="cardNumber"
                                label="Card number"
                                type='number'
                                fullWidth
                                autoComplete="cc-number"
                                variant="standard"
                                value={paymentData.cardNumber}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="expDate"
                                type='date'
                                helperText="Expiry date"
                                fullWidth
                                autoComplete="cc-exp"
                                variant="standard"
                                value={paymentData.expDate}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="cvv"
                                label="CVV"
                                type='number'
                                helperText="Last three digits on signature strip"
                                fullWidth
                                autoComplete="cc-csc"
                                variant="standard"
                                value={paymentData.cvv}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            type='submit'
                            sx={{ mt: 3, ml: 1 }}
                        >
                            Place order
                        </Button>
                    </Box>
                </form>
            )}

            {paymentMethod === 'Cash on Delivery' && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        type='submit'
                        onClick={handleSubmit}
                        sx={{ mt: 3, ml: 1 }}
                    >
                        Place order
                    </Button>
                </Box>
            )}

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} color={popupColor} />
        </React.Fragment>
    );
};

export default PaymentForm;
