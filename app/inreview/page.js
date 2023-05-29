'use client';

import ModalAddInreview from '@/components/ModalAddInreview';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useState } from 'react';

const page = () => {
  const [addForm, setAddForm] = useState(false);
  const handleAddForm = () => setAddForm(!addForm);

  if (addForm) return <ModalAddInreview handleForm={handleAddForm} />;

  return (
    <Grid
      container
      rowSpacing={5}
      sx={{
        width: '98%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Search */}
      <Grid item>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <TextField
            id='search'
            name='search'
            placeholder='Pencarian'
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { height: 35 } }}
          />
        </Box>
      </Grid>

      {/* Buttons */}
      <Grid item>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item>
            <Button
              variant='contained'
              sx={{ width: '180px', height: '30px', textTransform: 'none' }}
            >
              Gabung Master
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              sx={{ width: '180px', height: '30px', textTransform: 'none' }}
            >
              Import Products
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              sx={{ width: '200px', height: '30px', textTransform: 'none' }}
            >
              Download dari Online
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              sx={{ width: '140px', height: '30px', textTransform: 'none' }}
            >
              Refresh
            </Button>
          </Grid>
          <Grid item>
            <Button
              component='a'
              variant='contained'
              sx={{ width: '140px', height: '30px', textTransform: 'none' }}
              onClick={handleAddForm}
            >
              Tambah Baru
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default page;
