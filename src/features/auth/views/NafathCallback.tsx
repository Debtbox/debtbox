import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NafathCallback = () => {
  const { search } = useLocation();

  useEffect(() => {
    const payload = Object.fromEntries(new URLSearchParams(search).entries());

    try {
      window.opener?.postMessage(
        { type: 'nafath.signup.callback', payload },
        window.location.origin,
      );
    } catch {
      // ignore
    }

    // Let the browser paint at least once before closing.
    const id = window.setTimeout(() => window.close(), 0);
    return () => window.clearTimeout(id);
  }, [search]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
      <h1 className="text-xl font-semibold mb-2">Authentication complete</h1>
      <p className="text-sm text-[#6B7280]">
        You can close this window and return to the app.
      </p>
    </div>
  );
};

export default NafathCallback;

