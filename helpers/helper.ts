export const base64toFile = (base64: string, filename: string) => {
  // Get the MIME type and the base64 encoded data
  const mimeType = base64.split(',')[0].split(':')[1].split(';')[0];
  const data = base64.split(',')[1];

  // Decode the base64 encoded data and create a Blob object
  const binaryData = Buffer.from(data, 'base64').toString('binary');

  // Create a new Blob object
  const blob = new Blob([binaryData], { type: mimeType });

  // Create a new File object
  const file = new File([blob], filename, { type: mimeType });
  return file;
};
