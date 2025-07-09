'use client';

import { useEffect, useState } from 'react';
import { useAuthToken } from '@/hooks/useAuthToken';

export default function UserInfo() {
  const { getUser, validateToken, isValidating } = useAuthToken();
  const [user, setUser] = useState(getUser());
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Validate token and get fresh user data
    const checkAuth = async () => {
      const result = await validateToken();
      setIsValid(result.isValid);
      if (result.isValid && result.user) {
        setUser(result.user);
      }
    };

    checkAuth();
  }, [validateToken]);

  if (!user) {
    return (
      <div className="p-4 border rounded bg-gray-50">
        <p className="text-gray-600">Not logged in</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold mb-4">User Information</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Name:</span>
          <span>{user.name}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span>{user.email}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">User Type:</span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            user.userType === 'VIP' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {user.userType}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            user.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        {user.createdAt && (
          <div className="flex justify-between">
            <span className="font-medium">Member Since:</span>
            <span className="text-sm text-gray-600">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="font-medium">Token Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            isValid 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isValidating ? 'Validating...' : isValid ? 'Valid' : 'Invalid'}
          </span>
        </div>
      </div>
      
      {user.userType === 'VIP' && (
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="flex items-center">
            <span className="mr-2">👑</span>
            <span className="text-purple-800 font-medium">VIP Benefits Active</span>
          </div>
          <p className="text-sm text-purple-600 mt-1">
            You have access to exclusive VIP features and discounts.
          </p>
        </div>
      )}
    </div>
  );
} 