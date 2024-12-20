import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    Paper, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow,
    Card,
    CardContent
} from '@mui/material';
import { signals } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ResponsiveLine } from '@nivo/line';

const Dashboard = () => {
    const [activeSignals, setActiveSignals] = useState([]);
    const [stats, setStats] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [signalsRes, statsRes] = await Promise.all([
                    signals.getActive(),
                    signals.getStats(user.id)
                ]);
                setActiveSignals(signalsRes.data.signals);
                setStats(statsRes.data.stats);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, [user.id]);

    const performanceData = [
        {
            id: "success_rate",
            data: [
                { x: "Success Rate", y: stats?.success_rate || 0 }
            ]
        }
    ];

    return (
        <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total Signals</Typography>
                        <Typography variant="h4">{stats?.total_signals || 0}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Success Rate</Typography>
                        <Typography variant="h4">
                            {stats?.success_rate ? `${stats.success_rate.toFixed(1)}%` : '0%'}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Active Signals</Typography>
                        <Typography variant="h4">{activeSignals.length}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Performance Chart */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2, height: 300 }}>
                    <Typography variant="h6" gutterBottom>Performance</Typography>
                    <ResponsiveLine
                        data={performanceData}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{ type: 'linear', min: 0, max: 100 }}
                        axisTop={null}
                        axisRight={null}
                        enablePoints={true}
                        useMesh={true}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 100,
                                translateY: 0,
                                itemsSpacing: 0,
                                itemDirection: 'left-to-right',
                                itemWidth: 80,
                                itemHeight: 20,
                                itemOpacity: 0.75,
                                symbolSize: 12,
                                symbolShape: 'circle',
                                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemBackground: 'rgba(0, 0, 0, .03)',
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
                    />
                </Paper>
            </Grid>

            {/* Active Signals Table */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Active Signals</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Direction</TableCell>
                                <TableCell>Entry Price</TableCell>
                                <TableCell>Take Profit</TableCell>
                                <TableCell>Stop Loss</TableCell>
                                <TableCell>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeSignals.map((signal) => (
                                <TableRow key={signal.signal_id}>
                                    <TableCell>{signal.symbol}</TableCell>
                                    <TableCell>{signal.direction}</TableCell>
                                    <TableCell>{signal.entry_price}</TableCell>
                                    <TableCell>{signal.take_profit}</TableCell>
                                    <TableCell>{signal.stop_loss}</TableCell>
                                    <TableCell>
                                        {new Date(signal.created_at).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
