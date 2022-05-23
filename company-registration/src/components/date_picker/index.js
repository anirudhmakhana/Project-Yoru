import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import Stack from '@mui/material/Stack';

export const DatePicker = () => {
    const [value, setValue] = useState(
        new Date('2022-01-01T00:00:00.000Z')
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
            <DateTimePicker
                label="Date & Time"
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