import YAML from 'yaml';
import Papa from 'papaparse';

export function convertJSONToYAML(data: any): string {
  try {
    return YAML.stringify(data);
  } catch (err) {
    return '# Error generating YAML';
  }
}

export function convertJSONToCSV(data: any): string {
  try {
    // If data is an array of objects, parse directly
    if (Array.isArray(data)) {
      return Papa.unparse(data);
    }
    // If data is an object, wrap in array
    if (typeof data === 'object' && data !== null) {
      return Papa.unparse([data]);
    }
    return '';
  } catch (err) {
    return 'Error generating CSV';
  }
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
