/* eslint-disable no-unused-vars */
/**
=========================================================
 * Argon Dashboard 2 MUI - v3.0.0
=========================================================

 * Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// @mui material components
import Grid from "@mui/material/Grid";
import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import SpeedIcon from '@mui/icons-material/Speed';

// Argon Dashboard 2 MUI components

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Paper from '@material-ui/core/Paper';
import { Line } from 'react-chartjs-2';

function Default() {
    const [rpm, setRpm] = useState(null);
    const [voltage, setVoltage] = useState(null);
    const [rpmData, setRpmData] = useState([]);
    const [voltageData, setVoltageData] = useState([]);
    const [pwm, setPwm] = useState(100);

    const categories = []
    const arr = []
    const sv = []
    const srpm = []

    for (let i = 0; i < 30; i++)
        categories.push(i)

    const marks = [
        {
            value: 0,
            label: '0 RPM',
        },
        {
            value: 255,
            label: '255 RPM',
        },
    ];

    useEffect(() => {
        axios.get('https://api.thingspeak.com/channels/1839559/fields/1.json?api_key=N11LTANIFU3RSH5N&results=30')
            .then(response => {
                axios.get('https://api.thingspeak.com/channels/1839559/fields/2.json?api_key=N11LTANIFU3RSH5N&results=30')
                    .then(res => {
                        const labels = []
                        const data = []
                        response.data.feeds.map(val => {
                            labels.push(val.field1);
                        })
                        setRpmData(labels)

                        res.data.feeds.map(val => {
                            data.push(val.field2);
                        })
                        setVoltageData(data)

                        for (let i = 0; i < rpmData.length; i++)
                            arr.push([rpmData[i], voltageData[i]])

                        arr.sort((a, b) => a[1] - b[1])
                        for (let i = 0; i < arr.length; i++)
                            srpm.push(arr[i][0]), sv.push(arr[i][1])

                        console.log(sv)
                        console.log(srpm)
                    })
            })

        axios.get('https://api.thingspeak.com/channels/1839559/fields/1.json?api_key=N11LTANIFU3RSH5N&results=1')
            .then(res => {
                setRpm(res.data.feeds[0].field1);
            })

        axios.get('https://api.thingspeak.com/channels/1839559/fields/2.json?api_key=N11LTANIFU3RSH5N&results=1')
            .then(res => {
                setVoltage(res.data.feeds[0].field2);
            })
    }, [])

    useEffect(() => {
        console.log(pwm)
        axios.get('https://api.thingspeak.com/update?api_key=0LGM5L2SXPUYD8QQ&field1=' + pwm)
            .then(response => {
                console.log("value changed")
                console.log(response.status)
            })
    }, [pwm])

    return (
        <div>
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6} lg={1}>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ bgcolor: '#2196f3' }} >
                        <CardContent>
                            <Typography color="white" gutterBottom>
                                <Typography sx={{ fontSize: 20 }}>
                                    <SpeedIcon /> Latest RPM
                                </Typography>
                                {rpm}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ bgcolor: '#2196f3' }} >
                        <CardContent>
                            <Typography color="white" gutterBottom>
                                <Typography sx={{ fontSize: 20 }}>
                                    <ElectricMeterIcon /> Latest Voltage
                                </Typography>
                                {voltage}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6} lg={1}>
                </Grid>
                <Grid item xs={12} lg={8}>
                    <Paper>
                        <Line
                            data={{
                                labels: categories,
                                datasets: [{
                                    label: 'RPM',
                                    data: rpmData,
                                    fill: true,
                                    backgroundColor: 'red',
                                },{
                                    label: 'Voltage',
                                    data: voltageData,
                                    fill: true,
                                    backgroundColor: 'orange',
                                } ],
                            }}
                        >
                        </Line>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6} lg={1}>
                </Grid>
                <Grid item xs={12} lg={8}>
                    <Paper>
                        <Line
                            data={{
                                labels: rpmData,
                                datasets: [{
                                    label: 'Voltage',
                                    data: voltageData,
                                    fill: true,
                                } ],
                            }}
                        >
                        </Line>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6} lg={1}>
                </Grid>
                <Grid item>
                    <Box sx={{ width: 300, height: 15 }}>
                    <Slider
                        aria-label="Always visible"
                        defaultValue={0}
                        step={5}
                        max={255}
                        marks={marks}
                        onChange={val => setPwm(val.target.value)}
                        valueLabelDisplay="on"
                    />
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default Default;
