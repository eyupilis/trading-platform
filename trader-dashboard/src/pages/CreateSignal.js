import React, { useState } from 'react';
import {
    Paper,
    TextField,
    Button,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Box
} from '@mui/material';
import { signals } from '../services/api';
import WebSocketService from '../services/websocket';

const CreateSignal = () => {
    const [formData, setFormData] = useState({
        market_id: '',
        entry_price: '',
        stop_loss: '',
        take_profit: '',
        direction: '',
        analysis: ''
    });
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // API'ye sinyal gönder
            const response = await signals.create(formData);
            const signal = response.data.signal;

            // WebSocket üzerinden yeni sinyali yayınla
            WebSocketService.emitNewSignal(signal);

            setAlert({
                show: true,
                type: 'success',
                message: 'Signal created successfully!'
            });

            // Form'u temizle
            setFormData({
                market_id: '',
                entry_price: '',
                stop_loss: '',
                take_profit: '',
                direction: '',
                analysis: ''
            });
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: error.response?.data?.error || 'Error creating signal'
            });
        }
    };

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Create New Signal
            </Typography>

            {alert.show && (
                <Alert severity={alert.type} sx={{ mb: 2 }}>
                    {alert.message}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Market ID"
                            name="market_id"
                            value={formData.market_id}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Direction</InputLabel>
                            <Select
                                name="direction"
                                value={formData.direction}
                                onChange={handleChange}
                                label="Direction"
                            >
                                <MenuItem value="BUY">Buy</MenuItem>
                                <MenuItem value="SELL">Sell</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Entry Price"
                            name="entry_price"
                            type="number"
                            value={formData.entry_price}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Stop Loss"
                            name="stop_loss"
                            type="number"
                            value={formData.stop_loss}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Take Profit"
                            name="take_profit"
                            type="number"
                            value={formData.take_profit}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Analysis"
                            name="analysis"
                            multiline
                            rows={4}
                            value={formData.analysis}
                            onChange={handleChange}
                            placeholder="Enter your technical analysis here..."
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                            >
                                Create Signal
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default CreateSignal;
