import { Box, Grid } from '@mui/material';

export const OmniLabel = ({ children }) => {
  return (
    <Box sx={{ flex: 3, display: 'flex', justifyContent: 'flex-start' }}>
      {children}
    </Box>
  );
};

export const OmniField = ({ children, ...props }) => {
  return (
    <Box sx={{ flex: 9, gap: '1rem', flexWrap: 'wrap' }} {...props}>
      {children}
    </Box>
  );
};

export const CheckboxWrapper = ({ children, ...props }) => {
  return <Box sx={{ display: 'flex', alignItems: 'center' }}>{children}</Box>;
};

export const HeaderSpaceWrapper = ({ children, ...props }) => {
  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      {children}
    </Box>
  );
};

export const RowWrapper = ({ children }) => {
  return <Box sx={{ display: 'flex', gap: '1rem' }}>{children}</Box>;
};

export const SectionWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {children}
    </Box>
  );
};

export const SectionColumnWrapper = ({ children }) => {
  return (
    <Box
      sx={{ display: 'flex', padding: '1rem', flexWrap: 'wrap', gap: '1rem' }}
    >
      {children}
    </Box>
  );
};

export const ColumnWrapper = ({ children }) => {
  return (
    <Box
      sx={{ display: 'flex', flex: 6, flexDirection: 'column', gap: '0.5rem' }}
    >
      {children}
    </Box>
  );
};

export const Wrapper = ({ children }) => {
  return <Box>{children}</Box>;
};
