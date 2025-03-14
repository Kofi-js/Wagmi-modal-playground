import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';

export function WalletModal({ isOpen, onClose }) {
  const { address, isConnected, chain: currentChain } = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();

  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 modal-backdrop bg-black/75 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-blue-950 rounded-2xl shadow-2xl w-[500px] max-w-full border border-gray-800 transform transition-all duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6">
          <h3 className="text-xl font-semibold text-white">
            {isConnected ? 'Your Wallet' : 'Connect Wallet'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors duration-200 text-2xl focus:outline-none"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {isConnected ? (
            <div className="space-y-5">
              {/* Connected Wallet Info */}
              <div className="p-4 bg-transparent rounded-xl border border-gray-500">
                <div className="text-sm text-gray-400 mb-1">Connected Address</div>
                <div className="font-mono text-white text-lg">
                  {formatAddress(address)}
                </div>
              </div>

              {/* Current Network */}
              <div className="relative">
                <div 
                  className="p-4 bg-transparent rounded-xl border border-gray-500 flex justify-between items-center cursor-pointer hover:bg-gray-750 transition-colors duration-200"
                  onClick={() => setIsNetworkMenuOpen(!isNetworkMenuOpen)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${currentChain ? 'bg-green-700' : 'bg-red-700'} shadow-lg`}></div>
                    <div>
                      <div className="text-sm text-gray-400">Network</div>
                      <div className="text-white">{currentChain ? currentChain.name : "Not Connected"}</div>
                    </div>
                  </div>
                  <span className={`transform transition-transform text-white font-thin duration-200 ${isNetworkMenuOpen ? 'rotate-180' : ''}`}>v</span>
                </div>

                {/* Network Dropdown */}
                {isNetworkMenuOpen && chains && chains.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-10 overflow-hidden">
                    {chains.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 hover:bg-gray-700 cursor-pointer flex items-center justify-between text-white transition-colors duration-200"
                        onClick={() => {
                          switchChain({ chainId: c.id });
                          setIsNetworkMenuOpen(false);
                        }}
                      >
                        <span>{c.name}</span>
                        {currentChain?.id === c.id && (
                          <span className="text-green-500">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Disconnect Button */}
              <button
                onClick={() => disconnect()}
                className="w-full bg-red-900 text-white p-4 rounded-xl font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            /* Wallet Options */
            <div className="space-y-3">
              {error && (
                <div className="text-red-400 text-sm p-4 bg-red-900/50 rounded-xl border border-red-800 mb-4">
                  {error.message || "Failed to connect"}
                </div>
              )}

              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="w-full p-4 rounded-xl flex items-center justify-between border border-gray-700 bg-gray-800 hover:bg-gray-750 transition-colors duration-200 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <span>{connector.name}</span>
                  {typeof connector.icon === "string"? (
                    <img 
                    className="w-[30px] rounded-md"
                    src={connector.icon}
                    alt={`${connector.name} icon`}
                  />
                  ) : ""}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}