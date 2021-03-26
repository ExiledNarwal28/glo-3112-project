import React, { useState } from 'react';
import Camera from 'react-html5-camera-photo';
import { Box } from '@material-ui/core';

import { ImagePreview } from './ImagePreview';

import 'react-html5-camera-photo/build/css/index.css';

interface CamProps {
  isFullscreen: boolean;
  onPictureSnap: (data) => void;
}

const Cam = (props: CamProps) => {
  const { isFullscreen } = props;
  const [photoDataUri, setPhotoDataUri] = useState('');

  const handleTakePhotoAnimationDone = (dataUri) => {
    setPhotoDataUri(dataUri);
    props.onPictureSnap(dataUri);
  };

  return (
    <Box>
      {photoDataUri ? (
        <ImagePreview dataUri={photoDataUri} isFullscreen={isFullscreen} />
      ) : (
        <Camera onTakePhotoAnimationDone={handleTakePhotoAnimationDone} />
      )}
    </Box>
  );
};

export default Cam;
