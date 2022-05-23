import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Stack from '@mui/material/Stack';

export const ChartDatePicker = () => {
    const [value, setValue] = useState(
        new Date('2022-01-01')
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
            <DatePicker
                label="Date"
                renderInput={(params) => <TextField {...params} />}
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                }}
            />
            </Stack>
        </LocalizationProvider>
      );
}

export const ChartMonthPicker = () => {
    const [value, setValue] = useState(
        new Date('2022-01-01')
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
            <DatePicker
                views={['year', 'month']}
                label="Month"
                renderInput={(params) => <TextField {...params} />}
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                }}
            />
            </Stack>
        </LocalizationProvider>
      );
}

export const ChartYearPicker = () => {
    const [value, setValue] = useState(
        new Date('2022-01-01')
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
            <DatePicker
                views={['year']}
                label="Year"
                renderInput={(params) => <TextField {...params} />}
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                }}
            />
            </Stack>
        </LocalizationProvider>
      );
}