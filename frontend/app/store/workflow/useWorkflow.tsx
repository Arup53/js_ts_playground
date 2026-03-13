"use client";
import { create } from "zustand";

export const useWorkflowStore = create((set) => ({
  activeNode: null,
  setActiveNode: (id) => set({ activeNode: id }),
}));
