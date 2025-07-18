export default function CustomOrderPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Your Custom Piece</h1>
      <iframe
        src="https://www.cognitoforms.com/f/eZtWn73IYkeqXeYUulnMFA/1"
        allow="payment"
        title="Custom Order Form"
        className="w-full rounded-lg border-2 border-zinc-800 shadow-md"
        style={{ border: 0, width: '100%', minHeight: 600, overflow: 'hidden' }}
        scrolling="no"
      />
            <Script src="https://www.cognitoforms.com/f/iframe.js" strategy="afterInteractive" />
    </main>
  );
}
import Script from "next/script";
