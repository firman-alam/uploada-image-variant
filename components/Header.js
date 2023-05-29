import { Box, Button, Divider, Typography } from '@mui/material'
import { Close } from 'mdi-material-ui'
import React from 'react'

const Header = ({ title, handleForm }) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h6'>{title}</Typography>
        <Button>
          <Close onClick={handleForm} />
        </Button>
      </Box>
      <Divider />
    </>
  )
}

export default Header
