import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import XIcon from '../icons/XIcon';
import { Download, ExternalLink, Loader2 } from 'lucide-react';

interface PdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

const PdfViewer = ({ isOpen, onClose, pdfUrl, title }: PdfViewerProps) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Fetch PDF as blob when component opens
  useEffect(() => {
    if (!isOpen || !pdfUrl) {
      // Cleanup when closing
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
        setBlobUrl(null);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetchPdf = async () => {
      try {
        const response = await fetch(pdfUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setBlobUrl(url);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching PDF:', err);
        setError('Failed to load PDF. Please try again.');
        setIsLoading(false);
      }
    };

    fetchPdf();

    // Cleanup blob URL when component unmounts or closes
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
        setBlobUrl(null);
      }
    };
  }, [isOpen, pdfUrl]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      if (blobUrl) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = title || 'sanad.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback to original URL
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = title || 'sanad.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
    }
  };

  const handleOpenInNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    } else {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch PDF');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      setBlobUrl(url);
      setIsLoading(false);
    } catch {
      setError('Failed to load PDF. Please try again.');
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 100 }}>
      <div
        className="absolute inset-0 bg-black/80 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-2xl w-[95vw] h-[95vh] max-w-7xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {title || 'PDF Viewer'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={!blobUrl && isLoading}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={handleOpenInNewTab}
              disabled={!blobUrl && isLoading}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
              aria-label="Close PDF viewer"
            >
              <XIcon />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-hidden bg-gray-100 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                <p className="text-sm text-gray-500">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center gap-3 p-6">
                <p className="text-sm text-red-600 text-center">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {blobUrl && !isLoading && !error && (
            <object
              data={blobUrl}
              type="application/pdf"
              className="w-full h-full"
              aria-label="PDF Viewer"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Your browser doesn't support PDF preview.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={handleOpenInNewTab}
                      className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Open in New Tab
                    </button>
                  </div>
                </div>
              </div>
            </object>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal using portal at document.body level to isolate it from sideover
  return createPortal(modalContent, document.body);
};

export default PdfViewer;

