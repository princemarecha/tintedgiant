// components/Layout.js

import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="">
      <Sidebar />
      <div className="flex-1 p-4 sm:ml-72 bg-white">
        {children}
      </div>
    </div>
  );
}
