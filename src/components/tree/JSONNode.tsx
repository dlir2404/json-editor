import React, { useState, useEffect, useRef } from 'react';
import { getDataType, convertPathToJSONPath } from '../../utils/jsonParser';
import { DataTypeBadge } from './DataTypeBadge';
import { InlineEditor } from './InlineEditor';
import { TypePopover } from './TypePopover';
import { NodeControls } from './NodeControls';
import { ChevronRight, ChevronDown, Edit2 } from 'lucide-react';
import { JSONDataType } from '../../types/json';

interface JSONNodeProps {
  nodeKey?: string | number;
  value: any;
  path: (string | number)[];
  depth?: number;
  isLast?: boolean;
  onUpdateValue: (path: (string | number)[], newValue: any) => void;
  onUpdateKey: (path: (string | number)[], newKey: string) => void;
  onDeleteNode: (path: (string | number)[]) => void;
  onAddNode: (path: (string | number)[], keyName?: string, defaultValue?: any) => void;
  onDuplicateNode: (path: (string | number)[]) => void;
  onSelectPath: (path: (string | number)[]) => void;
  searchQuery?: string;
  activeMatchPathStr?: string;
}

export const JSONNode: React.FC<JSONNodeProps> = ({
  nodeKey,
  value,
  path,
  depth = 0,
  isLast = true,
  onUpdateValue,
  onUpdateKey,
  onDeleteNode,
  onAddNode,
  onDuplicateNode,
  onSelectPath,
  searchQuery = '',
  activeMatchPathStr,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isEditingValue, setIsEditingValue] = useState<boolean>(false);
  const [isEditingKey, setIsEditingKey] = useState<boolean>(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const dataType: JSONDataType = getDataType(value);
  const isContainer = dataType === 'object' || dataType === 'array';
  const isArray = dataType === 'array';

  const containerSize = isContainer ? (isArray ? value.length : Object.keys(value).length) : 0;

  // Search match highlighting & active focus tracking
  const jsonPathStr = convertPathToJSONPath(path);
  const isActiveMatch = activeMatchPathStr === jsonPathStr;

  const keyMatches = nodeKey !== undefined && searchQuery && String(nodeKey).toLowerCase().includes(searchQuery.toLowerCase());
  const valueMatches = !isContainer && searchQuery && String(value).toLowerCase().includes(searchQuery.toLowerCase());

  // Auto-expand parents if child or current node matches search
  useEffect(() => {
    if (searchQuery) {
      setIsExpanded(true);
    }
  }, [searchQuery]);

  // Scroll into view if this node is the active search match
  useEffect(() => {
    if (isActiveMatch && nodeRef.current) {
      nodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActiveMatch]);

  const handleTypeChange = (newType: JSONDataType) => {
    let defaultValue: any = '';
    if (newType === 'number') defaultValue = 0;
    if (newType === 'boolean') defaultValue = true;
    if (newType === 'null') defaultValue = null;
    if (newType === 'object') defaultValue = {};
    if (newType === 'array') defaultValue = [];
    onUpdateValue(path, defaultValue);
  };

  const renderValueText = () => {
    if (dataType === 'string') return <span className="text-emerald-600 dark:text-emerald-400">"{String(value)}"</span>;
    if (dataType === 'number') return <span className="text-amber-600 dark:text-amber-400">{String(value)}</span>;
    if (dataType === 'boolean') return <span className="text-purple-600 dark:text-purple-400">{String(value)}</span>;
    if (dataType === 'null') return <span className="text-slate-400 italic">null</span>;
    return null;
  };

  return (
    <div className="font-mono text-xs leading-relaxed selection:bg-indigo-500/20">
      <div
        ref={nodeRef}
        onClick={() => onSelectPath(path)}
        className={`group flex items-center py-1 px-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          isActiveMatch
            ? 'bg-amber-400/40 dark:bg-amber-400/30 ring-2 ring-amber-500 shadow-md scale-[1.01]'
            : keyMatches || valueMatches
            ? 'bg-amber-500/20 dark:bg-amber-500/20'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
        }`}
        style={{ paddingLeft: `${depth * 18 + 6}px` }}
      >
        {/* Expand / Collapse toggle button */}
        {isContainer ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 mr-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <span className="w-4 mr-1 inline-block" />
        )}

        {/* Node Key */}
        {nodeKey !== undefined && (
          <span className="mr-1.5 inline-flex items-center">
            {isEditingKey && typeof nodeKey === 'string' ? (
              <InlineEditor
                value={nodeKey}
                type="string"
                onSave={(newKey) => {
                  onUpdateKey(path, newKey);
                  setIsEditingKey(false);
                }}
                onCancel={() => setIsEditingKey(false)}
              />
            ) : (
              <span
                onDoubleClick={() => typeof nodeKey === 'string' && setIsEditingKey(true)}
                className={`font-semibold ${
                  keyMatches
                    ? 'text-amber-700 dark:text-amber-300 font-bold underline'
                    : 'text-indigo-600 dark:text-indigo-400 hover:underline'
                }`}
              >
                {typeof nodeKey === 'number' ? `[${nodeKey}]` : `"${nodeKey}"`}
              </span>
            )}
            <span className="text-slate-400 ml-0.5">:</span>
          </span>
        )}

        {/* Node Type Badge */}
        <span className="mr-2">
          <DataTypeBadge type={dataType} />
        </span>

        {/* Primitive Value or Container Preview */}
        {isContainer ? (
          <span className="text-slate-400 text-[11px]">
            {isArray ? '[' : '{'}
            <span className="text-slate-500 mx-1">
              {containerSize} {containerSize === 1 ? 'item' : 'items'}
            </span>
            {!isExpanded && (isArray ? ']' : '}')}
          </span>
        ) : (
          <span className="mr-2 inline-flex items-center">
            {isEditingValue ? (
              <InlineEditor
                value={value}
                type={dataType as 'string' | 'number' | 'boolean'}
                onSave={(newValue) => {
                  onUpdateValue(path, newValue);
                  setIsEditingValue(false);
                }}
                onCancel={() => setIsEditingValue(false)}
              />
            ) : (
              <span
                onDoubleClick={() => setIsEditingValue(true)}
                className={`cursor-pointer hover:underline ${valueMatches ? 'bg-amber-300 dark:bg-amber-500/80 text-slate-950 font-bold px-1 rounded' : ''}`}
              >
                {renderValueText()}
              </span>
            )}
            {!isEditingValue && (
              <button
                onClick={() => setIsEditingValue(true)}
                className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 text-slate-400 hover:text-indigo-500"
              >
                <Edit2 className="w-2.5 h-2.5" />
              </button>
            )}
          </span>
        )}

        {/* Type Converter Popover */}
        <TypePopover currentType={dataType} onTypeChange={handleTypeChange} />

        {/* Action Controls (+Child, Copy Value, Delete, Copy Path) */}
        <NodeControls
          isContainer={isContainer}
          onAddChild={() => onAddNode(path)}
          onCopyValue={() => {
            const text = isContainer ? JSON.stringify(value, null, 2) : JSON.stringify(value);
            navigator.clipboard.writeText(text);
          }}
          onDelete={() => onDeleteNode(path)}
          onCopyPath={() => {
            navigator.clipboard.writeText(jsonPathStr);
          }}
        />

        {!isLast && !isContainer && <span className="text-slate-400 ml-0.5">,</span>}
      </div>

      {/* Children Nodes rendering */}
      {isContainer && isExpanded && (
        <div className="border-l border-slate-200 dark:border-slate-800 ml-[11px]">
          {isArray
            ? (value as any[]).map((item, index) => (
                <JSONNode
                  key={index}
                  nodeKey={index}
                  value={item}
                  path={[...path, index]}
                  depth={depth + 1}
                  isLast={index === value.length - 1}
                  onUpdateValue={onUpdateValue}
                  onUpdateKey={onUpdateKey}
                  onDeleteNode={onDeleteNode}
                  onAddNode={onAddNode}
                  onDuplicateNode={onDuplicateNode}
                  onSelectPath={onSelectPath}
                  searchQuery={searchQuery}
                  activeMatchPathStr={activeMatchPathStr}
                />
              ))
            : Object.entries(value).map(([k, v], index, arr) => (
                <JSONNode
                  key={k}
                  nodeKey={k}
                  value={v}
                  path={[...path, k]}
                  depth={depth + 1}
                  isLast={index === arr.length - 1}
                  onUpdateValue={onUpdateValue}
                  onUpdateKey={onUpdateKey}
                  onDeleteNode={onDeleteNode}
                  onAddNode={onAddNode}
                  onDuplicateNode={onDuplicateNode}
                  onSelectPath={onSelectPath}
                  searchQuery={searchQuery}
                  activeMatchPathStr={activeMatchPathStr}
                />
              ))}
          <div className="py-0.5 text-slate-400" style={{ paddingLeft: `${(depth + 1) * 18}px` }}>
            {isArray ? ']' : '}'}
            {!isLast && ','}
          </div>
        </div>
      )}
    </div>
  );
};
