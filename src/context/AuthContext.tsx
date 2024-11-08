import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { isAdminAddress } from '../config/admin';
import { initializeUserPoints, updateAllUsersPoints, getUserPoints } from '../services/user';

interface AuthContextType {
  account: string | null;
  isAdmin: boolean;
  connecting: boolean;
  points: number;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshPoints: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();

  const refreshPoints = async () => {
    if (account) {
      try {
        const updatedPoints = await getUserPoints(account);
        setPoints(updatedPoints);
      } catch (error) {
        console.error('Error refreshing points:', error);
      }
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await updateAllUsersPoints();
        if (account) {
          await refreshPoints();
        }
      } catch (error) {
        console.error('Error during app initialization:', error);
      }
    };

    initializeApp();
  }, [account]);

  const checkAdminStatus = (address: string) => {
    return isAdminAddress(address);
  };

  const handleAccountConnected = async (address: string) => {
    try {
      const lowerAddress = address.toLowerCase();
      const userRef = doc(db, 'users', lowerAddress);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          address: lowerAddress,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          moviesSubmitted: 0,
          scenesSubmitted: 0
        });
        
        const initialPoints = await initializeUserPoints(lowerAddress);
        setPoints(initialPoints);
      } else {
        const currentPoints = await getUserPoints(lowerAddress);
        setPoints(currentPoints);
      }

      const adminStatus = checkAdminStatus(address);
      setAccount(lowerAddress);
      setIsAdmin(adminStatus);

      return adminStatus;
    } catch (error) {
      console.error('Error handling account connection:', error);
      throw new Error('Failed to connect account');
    }
  };

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setConnecting(true);
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          const adminStatus = await handleAccountConnected(accounts[0]);
          
          if (adminStatus) {
            navigate('/admin/events');
          } else {
            navigate('/dashboard');
          }
        } else {
          throw new Error('No accounts found');
        }
      } catch (error: any) {
        console.error('Error connecting wallet:', error);
        if (error.code === 4001) {
          throw new Error('Please approve wallet connection');
        }
        throw error;
      } finally {
        setConnecting(false);
      }
    } else {
      throw new Error('Please install MetaMask or another Ethereum wallet extension');
    }
  };

  const handleDisconnect = async () => {
    try {
      setAccount(null);
      setIsAdmin(false);
      setPoints(0);
      navigate('/login');
    } catch (error) {
      console.error('Error during disconnect:', error);
      setAccount(null);
      setIsAdmin(false);
      setPoints(0);
      navigate('/login');
    }
  };

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
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          await handleAccountConnected(accounts[0]);
        } else {
          await handleDisconnect();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      account,
      isAdmin,
      connecting,
      points,
      connect,
      disconnect: handleDisconnect,
      refreshPoints
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