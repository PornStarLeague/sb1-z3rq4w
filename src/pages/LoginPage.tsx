import React, { useState } from 'react';
import { Wallet, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { account, connecting, connect } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    try {
      setError(null);
      await connect();
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Connect Your Wallet</h1>
      <p className="mb-6 text-center text-gray-600">
        To participate in Fantasy Movie League, you need to connect your web3 wallet.
      </p>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {account ? (
        <div className="text-center">
          <p className="mb-4 font-semibold text-green-600">Wallet connected!</p>
          <p className="break-all font-mono bg-gray-50 p-3 rounded">
            {account}
          </p>
        </div>
      ) : (
        <button
          onClick={handleConnectWallet}
          disabled={connecting}
          className="w-full bg-blue-600 text-white py-3 rounded-full flex items-center justify-center space-x-2 hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet size={24} />
          <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      )}

      <p className="mt-4 text-sm text-center text-gray-500">
        By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default LoginPage;