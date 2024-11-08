import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface AuthContextType {
  account: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await handleAccountConnected(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length > 0) {
      await handleAccountConnected(accounts[0]);
    } else {
      handleDisconnect();
    }
  };

  const handleAccountConnected = async (address: string) => {
    try {
      const userRef = doc(db, 'users', address.toLowerCase());
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          address: address.toLowerCase(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          moviesSubmitted: 0,
          points: 0
        });
      }

      setAccount(address.toLowerCase());
    } catch (error) {
      console.error('Error handling account connection:', error);
      throw error;
    }
  };

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setConnecting(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        await handleAccountConnected(accounts[0]);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error connecting wallet:', error);
        throw error;
      } finally {
        setConnecting(false);
      }
    } else {
      throw new Error('Please install MetaMask or another Ethereum wallet extension.');
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      account,
      connecting,
      connect,
      disconnect: handleDisconnect
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};