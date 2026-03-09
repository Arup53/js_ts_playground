// components/workflow_builder/nodes/MultiHandleNode.tsx
"use client";

import { Handle, Position } from "@xyflow/react";

const handleStyle = { left: 10 };
const handleStyle2 = { left: 82 };

export function MultiHandleNode({ data }: { data: { label: string } }) {
  return (
    <div className="text-updater-node">
      <div>Custom Node</div>
      <Handle type="target" position={Position.Top} />
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
      />
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="c"
        style={handleStyle2}
      />
    </div>
  );
}
