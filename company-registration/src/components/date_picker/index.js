import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Stack from '@mui/material/Stack';

export const ChartDatePicker = ( {date, setDate}) => {

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
            <DatePicker
                label="Date"
                renderInput={(params) => <TextField {...params} />}
                value={date}
                onChange={(newValue) => {
                    console.log(newValue)
                    setDate(newValue);
                }}
            />
            </Stack>
        </LocalizationProvider>
      );
}

export const ChartMonthPicker = ({date, setDate}) => {

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
            <DatePicker
                views={['year', 'month']}
                label="Month"
                renderInput={(params) => <TextField {...params} />}
                value={date}
                onChange={(newValue) => {
                    setDate(newValue);
                }}
            />
            </Stack>
        </LocalizationProvider>
      );
}

export const ChartYearPicker = ({date, setDate}) => {

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
            <DatePicker
                views={['year']}
                label="Year"
                renderInput={(params) => <TextField {...params} />}
                value={date}
                onChange={(newValue) => {
                    setDate(newValue);
                }}
            />
            </Stack>
        </LocalizationProvider>
      );
}