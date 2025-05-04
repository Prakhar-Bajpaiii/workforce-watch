'use client';
import React, { useState } from 'react';
import {
  startAuthentication,
} from '@simplewebauthn/browser';

const Authenticator = () => {
  const [status, setStatus] = useState('');

  const handleFingerprintAuth = async () => {
    setStatus('Waiting for fingerprint...');
    try {
      // Fetch authentication options from your backend
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webauthn/generate-authentication-options`, {
        credentials: 'include',
      });
      const options = await resp.json();

      // Start authentication with browser
      const asseResp = await startAuthentication(options);

      // Send the authentication response to your backend for verification
      const verificationResp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webauthn/verify-authentication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(asseResp),
      });

      const verificationJSON = await verificationResp.json();

      if (verificationJSON && verificationJSON.verified) {
        setStatus('Authentication successful!');
      } else {
        setStatus('Authentication failed.');
      }
    } catch (err) {
      setStatus('Authentication error: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Fingerprint Authentication</h2>
      <button
        onClick={handleFingerprintAuth}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Authenticate with Fingerprint
      </button>
      {status && <div className="mt-4 text-lg">{status}</div>}
    </div>
  );
};

export default Authenticator;