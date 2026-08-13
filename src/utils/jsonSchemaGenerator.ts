type JsonSchema = Record<string, unknown>;

const schemaKey = (schema: JsonSchema): string => JSON.stringify(schema);

const uniqueSchemas = (schemas: JsonSchema[]): JsonSchema[] => {
  const seen = new Set<string>();

  return schemas.filter((schema) => {
    const key = schemaKey(schema);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const inferSchema = (value: unknown): JsonSchema => {
  if (value === null) return { type: 'null' };

  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'array', items: {} };

    const itemSchemas = uniqueSchemas(value.map(inferSchema));
    return {
      type: 'array',
      items: itemSchemas.length === 1 ? itemSchemas[0] : { anyOf: itemSchemas },
    };
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    const properties = Object.fromEntries(entries.map(([key, item]) => [key, inferSchema(item)]));
    const schema: JsonSchema = { type: 'object', properties };

    if (entries.length > 0) schema.required = entries.map(([key]) => key);
    return schema;
  }

  if (typeof value === 'number') {
    return { type: Number.isInteger(value) ? 'integer' : 'number' };
  }

  if (typeof value === 'string' || typeof value === 'boolean') {
    return { type: typeof value };
  }

  return {};
};

export const generateJsonSchema = (data: unknown, title = 'RootObject'): string => {
  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title,
    ...inferSchema(data),
  };

  return JSON.stringify(schema, null, 2);
};
