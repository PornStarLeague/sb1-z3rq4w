import React, { useState } from 'react';
import { Wallet } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setError(null);
      } catch (err) {
        setError('Failed to connect wallet. Please try again.');
        console.error('Error connecting wallet:', err);
      }
    } else {
      setError('Please install MetaMask or another Ethereum wallet extension.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Connect Your Wallet</h1>
      <p className="mb-6 text-center text-gray-600">
        To contribute to the Fantasy Movie League Oracle, you need to connect your web3 wallet.
      </p>
      {account ? (
        <div className="text-center">
          <p className="mb-4 font-semibold text-green-600">Wallet connected!</p>
          <p className="break-all">Address: {account}</p>
        </div>
      ) : (
        <button
          onClick={handleConnectWallet}
          className="w-full bg-blue-600 text-white py-3 rounded-full flex items-center justify-center space-x-2 hover:bg-blue-700 transition duration-300"
        >
          <Wallet size={24} />
          <span>Connect Wallet</span>
        </button>
      )}
      {error && (
        <p className="mt-4 text-sm text-center text-red-500">{error}</p>
      )}
      <p className="mt-4 text-sm text-center text-gray-500">
        By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default LoginPage;