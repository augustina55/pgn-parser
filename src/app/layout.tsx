import "./globals.css"

export const metadata = {
  title: "PGN Detailer",
  description: "Convert PGN to FEN and piece list",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}