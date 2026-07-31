export function generateTypeScriptTypes(data: any, rootName = 'RootObject'): string {
  if (data === null || data === undefined) return `type ${rootName} = null;`;

  const interfaces: string[] = [];

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getType(val: any, keyName: string): string {
    if (val === null) return 'null';
    if (Array.isArray(val)) {
      if (val.length === 0) return 'any[]';
      const elemType = getType(val[0], keyName + 'Item');
      return `${elemType}[]`;
    }
    const type = typeof val;
    if (type === 'object') {
      const interfaceName = capitalize(keyName);
      buildInterface(val, interfaceName);
      return interfaceName;
    }
    return type;
  }

  function buildInterface(obj: Record<string, any>, name: string) {
    const lines: string[] = [];
    lines.push(`export interface ${name} {`);

    for (const [k, v] of Object.entries(obj)) {
      const isOptional = v === undefined || v === null;
      const propType = getType(v, k);
      lines.push(`  ${k}${isOptional ? '?' : ''}: ${propType};`);
    }

    lines.push(`}\n`);
    interfaces.unshift(lines.join('\n'));
  }

  if (typeof data === 'object' && !Array.isArray(data)) {
    buildInterface(data, rootName);
    return interfaces.join('\n');
  }

  return `type ${rootName} = ${getType(data, rootName)};`;
}
