"use client";

import { useCallback } from "react";
import {
  Background,
  Connection,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { Sidebar } from "../components/workflow_builder/sidebar/Sidebar";
import { DnDProvider } from "../hooks/workflow/dnd/useDnD";
import { MultiHandleNode } from "../components/nodes/customNode";
import { useWorkflowStore } from "../store/workflow/useWorkflow";
import InspectorPanel from "../components/workflow_builder/InspectorPannel";

const nodeTypes = {
  multiHandle: MultiHandleNode,
};

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "input node" },
    position: { x: 250, y: 5 },
  },
];

function DnDFlow() {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const activeNode = useWorkflowStore((s) => s.activeNode);
  const setActiveNode = useWorkflowStore((s) => s.setActiveNode);

  const onNodeClick = useCallback((event, node) => {
    setActiveNode(node.id);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{ type: "step" }}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <>
        {!activeNode && <Sidebar />}
        {activeNode && <InspectorPanel />}
      </>
    </div>
  );
}

export default function page() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
    </ReactFlowProvider>
  );
}
