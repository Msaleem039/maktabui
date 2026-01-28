import ReduxProviderWrapper from "@/redux/ReduxProviderWrapper";
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ReduxProviderWrapper>{children}</ReduxProviderWrapper>
      </body>
    </html>
  );
}
