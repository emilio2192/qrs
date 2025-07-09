'use client';

import { useEffect, useState } from 'react';
import { useAuthToken } from '@/hooks/useAuthToken';

export default function TokenValidator() {
  const { validateToken, isValidating, getToken } = useAuthToken();
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    user?: any;
    error?: string;
  } | null>(null);

  const handleValidateToken = async () => {
    const result = await validateToken();
    setValidationResult(result);
  };

  useEffect(() => {
    // Auto-validate token on component mount if token exists
    const token = getToken();
    if (token) {
      handleValidateToken();
    }
  }, []);

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">Token Validation</h3>
      
      <button
        onClick={handleValidateToken}
        disabled={isValidating}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isValidating ? 'Validating...' : 'Validate Token'}
      </button>

      {validationResult && (
        <div className="mt-4">
          {validationResult.isValid ? (
            <div className="text-green-600">
              <p>✅ Token is valid!</p>
              {validationResult.user && (
                <div className="mt-2 text-sm">
                  <p><strong>User:</strong> {validationResult.user.name}</p>
                  <p><strong>Email:</strong> {validationResult.user.email}</p>
                  <p><strong>Type:</strong> {validationResult.user.userType}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600">
              <p>❌ Token is invalid or expired</p>
              {validationResult.error && (
                <p className="text-sm mt-1">{validationResult.error}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 