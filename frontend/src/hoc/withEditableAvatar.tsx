import React, { useEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import useUploadToS3 from "../hooks/images/useUploadToS3";

// TODO : Use this instead of awsS3
export function withEditableAvatar(WrappedComponent) {
  const [showToast, setShowToast] = useState(false);
  const [reference] = useState(null);
  const [error] = useState(null);

  useEffect(() => {
    if (error) {
      setShowToast(true);
    }
  }, [error]);

  return class extends React.Component {
    uploadFile = (file) => {
      useUploadToS3(file, 'avatars')
    }

    handleToastClose = () => {
      setShowToast(false);
    };

    render() {
      return (
        <div>
          <WrappedComponent
            {...this.props}
            src={reference}
            onUpload={this.uploadFile}
          />
          <Snackbar
            open={showToast}
            autoHideDuration={6000}
            onClose={this.handleToastClose}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={this.handleToastClose}
              severity="error"
            >
              Something went wrong! Please try to reupload the image.
            </MuiAlert>
          </Snackbar>
        </div>
      );
    }
  }
}
