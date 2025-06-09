export const openCloudinaryWidget = (callback) => {
  window.cloudinary.createUploadWidget(
    {
      cloudName: 'your-cloud-name',
      uploadPreset: 'your-upload-preset',
      sources: ['local', 'url'],
      multiple: false,
      resourceType: 'video',
      maxFileSize: 15000000, // 15MB
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        callback(result.info.secure_url);
      }
    }
  ).open();
};