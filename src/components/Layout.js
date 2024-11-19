// components/Layout.js

import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 sm:ml-72">
        {children}
      </div>
    </div>
  );
}
