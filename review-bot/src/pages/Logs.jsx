import React from "react";
import { LogViewer } from "../components/logviewer";

export const LogsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Логи системы</h2>
      </div>
      <LogViewer />
    </div>
  );
};
