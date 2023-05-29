import { Box, Dialog, Paper } from '@mui/material';
import { useState } from 'react';
import Header from './Header';
import Dropzone from './Dropzone';

const ModalVariantImage = ({ id, open, onClose, handleImage, uploadFile }) => {
  console.log(uploadFile);
  // dropzone
  const [idImage, setIdImage] = useState(1);

  // dropzone function
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = (error) =>
        console.warn(`Reading of file ${file.name} was aborted.`);
      reader.onerror = (error) =>
        console.error(`Reading of file ${file.name} has failed.`);
      reader.onloadend = (e) => {
        const imagesData = {
          FileName: file.name,
          FileData: e.target.result,
          id: idImage,
        };

        handleImage([...uploadFile, imagesData]);
        setIdImage((prevId) => prevId + 1);
      };

      reader.readAsDataURL(file);
    });
  };

  // dropzone function
  const removeImage = (value) => {
    handleImage(uploadFile.filter((item) => item.id !== value));
  };

  // Filter uploaded images based on the current row's ID

  return (
    <Dialog open={open} components={Paper} onClose={onClose}>
      <Box
        component={Paper}
        sx={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header title={id} handleForm={onClose} />

        <Box
          sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <Dropzone
            onDrop={onDrop}
            uploadFile={uploadFile}
            removeImage={removeImage}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default ModalVariantImage;
