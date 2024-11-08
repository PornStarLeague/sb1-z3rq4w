import { ethers } from 'ethers';

// Admin wallet address (checksum format)
const ADMIN_ADDRESS = '0x8216474eC890bb0E1bFab1278b5aab995cDf4b67';

export const isAdminAddress = (address: string): boolean => {
  try {
    if (!address) return false;
    
    // Convert both addresses to lowercase for comparison
    const inputAddress = address.toLowerCase();
    const adminAddress = ADMIN_ADDRESS.toLowerCase();
    
    const isAdmin = inputAddress === adminAddress;
    console.log('Admin check:', { input: inputAddress, admin: adminAddress, isAdmin });
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin address:', error);
    return false;
  }
};