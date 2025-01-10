
export const metadata = {
  title: "Tinted Giant - Trucks",
  description: "Generated by create next app",
  icons: {
    icon: "/images/logo.png", // Path to your favicon file
    shortcut: "/images/logo.png", // Shortcut icon for older browsers
    apple: "/images/logo.png", // Apple Touch Icon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
