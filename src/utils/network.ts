import { ethers } from 'ethers';

export const PALM_NETWORK = {
  chainId: '0x2a15c308d',
  chainName: 'Palm Network',
  nativeCurrency: {
    name: 'PALM',
    symbol: 'PALM',
    decimals: 18
  },
  rpcUrls: ['https://palm-mainnet.public.blastapi.io'],
  blockExplorerUrls: ['https://explorer.palm.io']
};

export const getDoraProvider = () => {
  return new ethers.JsonRpcProvider('https://palm-mainnet.public.blastapi.io');
};

export const switchToPalmNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) {
    throw new Error('No Web3 provider found');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: PALM_NETWORK.chainId }],
    });
    return true;
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [PALM_NETWORK],
        });
        return true;
      } catch (addError) {
        console.error('Error adding Palm Network:', addError);
        return false;
      }
    }
    console.error('Error switching to Palm Network:', switchError);
    return false;
  }
};

export const getCurrentNetwork = async (): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('No Web3 provider found');
  }

  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  return chainId;
};