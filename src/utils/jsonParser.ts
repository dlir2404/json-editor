import { JSONDataType, JSONStats, ParseError } from '../types/json';

export function getDataType(value: any): JSONDataType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const type = typeof value;
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'boolean') return 'boolean';
  if (type === 'object') return 'object';
  return 'string';
}

export function safeJsonParse(text: string): { data: any; error: ParseError | null } {
  try {
    const data = JSON.parse(text);
    return { data, error: null };
  } catch (err: any) {
    const message = err?.message || 'Invalid JSON syntax';
    let line: number | undefined;
    let column: number | undefined;

    // Try extracting line and column numbers from standard V8 JSON parse errors
    const lineColMatch = message.match(/at line (\d+) column (\d+)/i) || message.match(/position (\d+)/i);
    if (lineColMatch) {
      if (lineColMatch[1] && lineColMatch[2]) {
        line = parseInt(lineColMatch[1], 10);
        column = parseInt(lineColMatch[2], 10);
      }
    }

    return {
      data: null,
      error: { message, line, column },
    };
  }
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function calculateJSONStats(data: any, rawText: string): JSONStats {
  const bytes = new Blob([rawText]).size;
  let totalKeys = 0;
  let maxDepth = 0;
  let totalNodes = 0;

  function traverse(node: any, currentDepth: number) {
    totalNodes++;
    if (currentDepth > maxDepth) maxDepth = currentDepth;

    if (node !== null && typeof node === 'object') {
      if (Array.isArray(node)) {
        node.forEach((item) => traverse(item, currentDepth + 1));
      } else {
        const keys = Object.keys(node);
        totalKeys += keys.length;
        keys.forEach((key) => traverse(node[key], currentDepth + 1));
      }
    }
  }

  if (data !== undefined && data !== null) {
    traverse(data, 1);
  }

  return {
    sizeInBytes: bytes,
    formattedSize: formatBytes(bytes),
    totalKeys,
    maxDepth,
    totalNodes,
  };
}

export function getValueByPath(data: any, path: (string | number)[]): any {
  let current = data;
  for (const key of path) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current;
}

export function updateValueByPath(data: any, path: (string | number)[], newValue: any): any {
  if (path.length === 0) return newValue;

  // Deep clone to prevent direct state mutation
  const root = Array.isArray(data) ? [...data] : { ...data };
  let current = root;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const nextKey = path[i + 1];

    if (Array.isArray(current[key])) {
      current[key] = [...current[key]];
    } else if (typeof current[key] === 'object' && current[key] !== null) {
      current[key] = { ...current[key] };
    } else {
      // Create path node if missing
      current[key] = typeof nextKey === 'number' ? [] : {};
    }
    current = current[key];
  }

  const lastKey = path[path.length - 1];
  current[lastKey] = newValue;
  return root;
}

export function updateKeyByPath(data: any, path: (string | number)[], newKey: string): any {
  if (path.length === 0) return data;

  const root = Array.isArray(data) ? [...data] : { ...data };
  let current = root;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    current = current[key];
  }

  const oldKey = path[path.length - 1];
  if (typeof oldKey === 'number' || Array.isArray(current)) {
    return root; // Array indices cannot change key names
  }

  if (oldKey in current) {
    const value = current[oldKey];
    delete current[oldKey];
    current[newKey] = value;
  }

  return root;
}

export function deleteNodeByPath(data: any, path: (string | number)[]): any {
  if (path.length === 0) return null;

  const root = Array.isArray(data) ? [...data] : { ...data };
  let current = root;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    current = current[key];
  }

  const lastKey = path[path.length - 1];
  if (Array.isArray(current) && typeof lastKey === 'number') {
    current.splice(lastKey, 1);
  } else if (typeof current === 'object' && current !== null) {
    delete current[lastKey];
  }

  return root;
}

export function addNodeByPath(data: any, path: (string | number)[], keyName?: string, defaultValue: any = ''): any {
  const root = Array.isArray(data) ? [...data] : { ...data };
  let target = root;

  for (const p of path) {
    target = target[p];
  }

  if (Array.isArray(target)) {
    target.push(defaultValue);
  } else if (typeof target === 'object' && target !== null) {
    const newKey = keyName || `newKey_${Object.keys(target).length + 1}`;
    target[newKey] = defaultValue;
  }

  return root;
}

export function duplicateNodeByPath(data: any, path: (string | number)[]): any {
  if (path.length === 0) return data;

  const root = Array.isArray(data) ? [...data] : { ...data };
  let current = root;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    current = current[key];
  }

  const lastKey = path[path.length - 1];
  const targetValue = JSON.parse(JSON.stringify(current[lastKey]));

  if (Array.isArray(current) && typeof lastKey === 'number') {
    current.splice(lastKey + 1, 0, targetValue);
  } else if (typeof current === 'object' && current !== null) {
    const newKey = `${lastKey}_copy`;
    current[newKey] = targetValue;
  }

  return root;
}

export function convertPathToJSONPath(path: (string | number)[]): string {
  if (path.length === 0) return '$';
  return '$' + path.map((segment) => (typeof segment === 'number' ? `[${segment}]` : `.${segment}`)).join('');
}
