export type JSONDataType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

export interface JSONNodePath {
  path: (string | number)[];
  jsonPathStr: string;
}

export type ViewMode = 'split' | 'tree' | 'code';
export type Theme = 'dark' | 'light';

export interface ParseError {
  message: string;
  line?: number;
  column?: number;
}

export interface SearchMatch {
  path: (string | number)[];
  jsonPathStr: string;
  matchedKey?: boolean;
  matchedValue?: boolean;
}

export interface JSONStats {
  sizeInBytes: number;
  formattedSize: string;
  totalKeys: number;
  maxDepth: number;
  totalNodes: number;
}

export interface PresetItem {
  id: string;
  name: string;
  description: string;
  category: 'User' | 'API' | 'Commerce' | 'Config';
  data: any;
}
