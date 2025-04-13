import React, { useState } from "react";

export function StudentDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
