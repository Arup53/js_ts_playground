"use client";
import { useWorkflowStore } from "@/app/store/workflow/useWorkflow";
import { useReactFlow } from "@xyflow/react";

export default function InspectorPanel() {
  const activeNode = useWorkflowStore((s) => s.activeNode);
  const nodes = useReactFlow().getNodes();

  const node = nodes.find((n) => n.id === activeNode);
  console.log(node);
  return (
    <div>
      <h3>Inspector</h3>
      <p>{node?.data?.label}</p>
    </div>
  );
}
