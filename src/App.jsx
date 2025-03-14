import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount } from 'wagmi';
import { config } from './config/config';
import Navbar from './components/Navbar';
import Hero from './components/Hero';


function App() {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <Navbar />
        <Hero/>
      </QueryClientProvider> 
    </WagmiProvider>
  );
}

export default App;