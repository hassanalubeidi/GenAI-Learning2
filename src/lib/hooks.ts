// hooks/useFileUpload.js
import { useState } from 'react';

const useFileUpload = () => {
  const [extractedText, setExtractedText] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(',')[1];

      try {
        const response = await fetch('/api/pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ base64Data }),
        });

        const data = await response.json();
        setExtractedText(data.text);
      } catch (error) {
        console.error('Error parsing PDF:', error);
      }
    };

    reader.readAsDataURL(file);
  };

  return {
    extractedText,
    handleFileUpload,
  };
};

export default useFileUpload;