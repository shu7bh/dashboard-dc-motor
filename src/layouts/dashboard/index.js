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
import Icon from "@mui/material/Icon";
import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import CategoriesList from "examples/Lists/CategoriesList";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Argon Dashboard 2 MUI base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
//import Slider from "layouts/dashboard/components/Slider";

// Data
import salesTableData from "layouts/dashboard/data/salesTableData";
import categoriesListData from "layouts/dashboard/data/categoriesListData";

function Default() {
    const { size } = typography;
    const [count, setCount] = useState(0);
    const [chartData, setChartData] = useState({});

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

    function valuetext(value) {
        return `${value}°C`;
    }
    useEffect(() => {
        axios.get('https://api.thingspeak.com/channels/1839559/feeds.json?api_key=N11LTANIFU3RSH5N&results=30')
            .then(response => {
                setCount(response.data.feeds[2].field1);
                console.log(response.data.feeds);
                const labels = []
                const data = []
                response.data.feeds.map(val => {
                    data.push(val.field2)
                    labels.push(val.field1);
                })
                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: "RPM",
                            color: "info",
                            data: data,
                        },
                    ],
                })
            })
    }, [])

    return (
        <DashboardLayout>
            <ArgonBox py={3}>
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={6} lg={3}>
                        <DetailedStatisticsCard
                        title="today's money"
                        count={count}
                        icon={{ color: "info", component: <i className="ni ni-money-coins" /> }}
                        percentage={{ color: "success", count: "+55%", text: "since yesterday" }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <DetailedStatisticsCard
                        title="today's users"
                        count="2,300"
                        icon={{ color: "error", component: <i className="ni ni-world" /> }}
                        percentage={{ color: "success", count: "+3%", text: "since last week" }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <DetailedStatisticsCard
                        title="new clients"
                        count="+3,462"
                        icon={{ color: "success", component: <i className="ni ni-paper-diploma" /> }}
                        percentage={{ color: "error", count: "-2%", text: "since last quarter" }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <DetailedStatisticsCard
                        title="sales"
                        count="$103,430"
                        icon={{ color: "warning", component: <i className="ni ni-cart" /> }}
                        percentage={{ color: "success", count: "+5%", text: "than last month" }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} lg={7}>
                        <GradientLineChart
                        title="Sales Overview"
                        description={
                            <ArgonBox display="flex" alignItems="center">
                            <ArgonBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                            <Icon sx={{ fontWeight: "bold" }}>arrow_upward</Icon>
                            </ArgonBox>
                            <ArgonTypography variant="button" color="text" fontWeight="medium">
                            4% more{" "}
                            <ArgonTypography variant="button" color="text" fontWeight="regular">
                            in 2022
                            </ArgonTypography>
                            </ArgonTypography>
                            </ArgonBox>
                        }
                        chart={chartData}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} mb={3}>
                    <Grid item>
                        <Box sx={{ width: 300, height: 15 }}>
                        <Slider
                            aria-label="Always visible"
                            defaultValue={100}
                            getAriaValueText={valuetext}
                            step={5}
                            max={255}
                            marks={marks}
                            valueLabelDisplay="on"
                        />
                        </Box>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <SalesTable title="Sales by Country" rows={salesTableData} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <CategoriesList title="categories" categories={categoriesListData} />
                    </Grid>
                </Grid>
            </ArgonBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Default;
