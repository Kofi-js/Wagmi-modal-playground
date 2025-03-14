import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount } from 'wagmi';
import { config } from './config/config';
import { Account } from './components/Account';
import { WalletModal } from './components/WalletModal';

function ConnectWallet() {
  const { isConnected } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4">
      <button 
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {isConnected ? 'Manage Wallet' : 'Connect Wallet'}
      </button>
      
      {isConnected && <div className="mt-4"><Account /></div>}
      
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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