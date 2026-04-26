import "./globals.css";

export const metadata = {
  title: "El Libro Mágico de Mateo",
  description: "Aventuras narradas para soñar, imaginar y sonreír juntos.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6dfaa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
