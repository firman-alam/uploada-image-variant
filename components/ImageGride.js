import React, { useState, useEffect } from "react"
import CloseIcon from 'mdi-material-ui/CloseCircle'
import IconButton from '@mui/material/IconButton'

const Image = ({ image, removeImage }) => {
  const iconTag = {
    position: 'relative',
    bottom: 116,
    right: 12,
    zIndex: 1000,
    width: '12px !important',
    height: '12px !important',
    color: '#dc143c',
    backgroundColor: '#ffffff'
  }

  return (
    <div className='file-item'>
      <img alt={`img - ${image?.FileName}`} src={image.FileData || image} className='file-img' />
      <IconButton sx={iconTag} aria-label='close' size='small' onClick={() => removeImage(image.id)}>
        <CloseIcon />
      </IconButton>
    </div>
  )
}


// ImageList Component//
const ImageGride = ({ images, removeImage }) => {

  // render each image by calling Image component
  const renderImage = (image, index) => {
    return <Image image={image} key={index} removeImage={removeImage} />
  }


  return (
    <section className="file-list">
      {images.map(renderImage)}
    </section>
  )

}

export default ImageGride;