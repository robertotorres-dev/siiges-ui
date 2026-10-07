import React from 'react';
import { Box, Stack } from '@mui/material';

export default function InstitucionesSkeleton() {
  return (
    <Box sx={{ padding: 2 }}>
      <Stack spacing={2}>
        {[0, 1, 2, 3].map((item) => (
          <Box
            key={item}
            sx={{
              height: 36,
              borderRadius: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
