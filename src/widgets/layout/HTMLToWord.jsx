import React from 'react';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import { Button } from '@material-tailwind/react';

class HTMLToWord extends React.Component {
  exportToWord = async () => {
    const { htmlContent } = this.props; // Your HTML content to be exported

    try {
      // Convert HTML to Word
      const utf8Encoder = new TextEncoder();
      const encodedContent = utf8Encoder.encode(htmlContent);

      const { arrayBuffer } = await mammoth.convertToHtml({
        // Pass the encoded content as a Uint8Array
        buffer: encodedContent,
      }, {
        // Options for conversion
        format: 'docx',
      });

      // Save the converted content as a .docx file
      const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, 'exportedContent.docx');
    } catch (error) {
      console.error('Error exporting to Word:', error);
    }
  };

  render() {
    return (
      <div>
        {/* Your React components and HTML content */}
        <Button color='white' onClick={this.exportToWord}>Export to Word</Button>
      </div>
    );
  }
}

export default HTMLToWord;
