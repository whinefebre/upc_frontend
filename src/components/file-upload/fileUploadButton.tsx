import { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';
export interface FileData {
  [key: string]: any;
}

const FileUploadButton: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const json = JSON.parse(result);
          setFileData(json);
          localStorage.setItem('uploadedData', JSON.stringify(json));
          alert('File uploaded and saved to local storage successfully!');
        }
      } catch (error) {
        alert('Invalid JSON file');
      }
    };

    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  };


  return (
    <div>
      {/* <input type="file" accept=".json,.geojson" onChange={handleFileUpload} /> */}
      {/* <Button
              component={RouterLink}
              href={paths.dashboard.invoice.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Invoice
            </Button> */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="file"
          id="file-input"
          accept=".json,.geojson"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <Button variant="contained" color="primary" onClick={handleButtonClick} startIcon={<Iconify icon="mingcute:add-line" />}>
          Upload File
        </Button>
      </div>
      {/* {fileData && <pre>{JSON.stringify(fileData, null, 2)}</pre>} */}
    </div>
  );
};

export default FileUploadButton;