export const downloadFile = async (url: string, filename?: string) => {
  try {
    // Fetch the file as a blob to handle CORS and Chrome's cross-origin restrictions
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Create download link with download attribute
    const a = document.createElement('a');
    a.href = blobUrl;
    if (filename) {
      a.download = filename;
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up blob URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error('Error downloading file:', error);
    // Fallback to opening in new tab if blob download fails
    window.open(url, '_blank', 'noopener,noreferrer');
    throw error;
  }
};
