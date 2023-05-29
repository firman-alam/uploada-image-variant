import { React, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import ImageGride from './ImageGride';

function Dropzone({ onDrop, accept, uploadFile, removeImage }) {
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept,
  });

  const focusedStyle = {
    borderColor: '#2196f3',
  };

  const acceptStyle = {
    borderColor: '#00e676',
  };

  const rejectStyle = {
    borderColor: '#ff1744',
  };

  const widthUploader = () => {
    if (uploadFile?.length > 0) {
      return '15vh';
    } else {
      return '25vh';
    }
  };

  const baseStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: widthUploader(),
  };

  const getBorderColor = () => {
    if (isFocused) return '#2196f3';

    if (isDragAccept) return '#00e676';

    if (isDragReject) return '#ff1744';
  };

  const UploadWrapper = useMemo(
    () => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: getBorderColor(),
      backgroundColor: '#fafafa',
      color: '#bdbdbd',
      outline: 'none',
      transition: 'border .24s ease-in-out',
      minHeight: '25vh',
      width: '85%',
      ml: 5,
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const style = useMemo(
    () => ({
      ...baseStyle,
      // ...(isFocused ? focusedStyle : {}),
      // ...(isDragAccept ? acceptStyle : {}),
      // ...(isDragReject ? rejectStyle : {})
    }),
    [
      // isFocused,
      // isDragAccept,
      // isDragReject,
      uploadFile,
    ]
  );

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Grid container sx={UploadWrapper}>
      <Grid item xs={12} sx={{ mb: 2 }}>
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Lepas filenya dan taruh di sini</p>
          ) : (
            <p>
              Tarik beberapa file dan taruh disini, atau klik untuk memilih file
            </p>
          )}
        </div>
      </Grid>
      {uploadFile?.length > 0 ? (
        <Grid item xs={12}>
          <ImageGride images={uploadFile} removeImage={removeImage} />
        </Grid>
      ) : null}
    </Grid>
  );
}

export default Dropzone;
