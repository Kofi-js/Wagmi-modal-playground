import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount } from 'wagmi';
import { config } from './config/config';
import { WalletModal } from './components/WalletModal';

function ConnectWallet() {
  const { isConnected } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { address } = useAccount()

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className='text-2xl font-semibold'>Wagmi Connector</h1>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
       {isConnected ? formatAddress(address) : "Connect Wallet"}
      </button>
      
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
    </div>

  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <ConnectWallet />
      </QueryClientProvider> 
    </WagmiProvider>
  );
}

export default App;