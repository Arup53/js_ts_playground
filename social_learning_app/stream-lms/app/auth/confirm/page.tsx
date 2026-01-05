import { Suspense } from "react";

interface ConfirmPageProps {
  searchParams: {
    token?: string;
  };
}

export default function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold text-red-600">
          Invalid confirmation link
        </h1>
        <p className="mt-2">No confirmation token found.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Confirming your account...</p>}>
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Confirming your account</h1>
        <p className="mt-2 text-gray-600">
          Please wait while we verify your token.
        </p>

        {/* You would usually call your API here */}
        <p className="mt-4 text-green-600">
          Token received: <code>{token}</code>
        </p>
      </div>
    </Suspense>
  );
}
