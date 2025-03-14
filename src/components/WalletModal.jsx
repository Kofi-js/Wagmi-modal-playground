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
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80 max-w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h3 className="font-medium text-white">{isConnected ? 'Your Wallet' : 'Connect Wallet'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          {isConnected ? (
            <div className="space-y-4">
              {/* Connected Wallet Info */}
              <div className="flex items-center space-x-3">
                  <div className="font-medium text-white">
                    {formatAddress(address)}
                  </div>
              </div>

              {/* Current Network */}
              <div className="relative">
                <div className="p-3 bg-gray-100 rounded-md flex justify-between items-center cursor-pointer"
                  onClick={() => setIsNetworkMenuOpen(!isNetworkMenuOpen)}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${currentChain ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{currentChain ? currentChain.name : "Not Connected"}</span>
                  </div>
                  <span>▼</span>
                </div>

                {/* Network Dropdown */}
                {isNetworkMenuOpen && chains && chains.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {chains.map((c) => (
                      <div
                        key={c.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                        onClick={() => {
                          switchChain({ chainId: c.id });
                          setIsNetworkMenuOpen(false);
                        }}
                      >
                        <span>{c.name}</span>
                        {currentChain?.id === c.id && <span>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Disconnect Button */}
              <button
                onClick={() => disconnect()}
                className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Disconnect
              </button>
            </div>
          ) : (
            /* Wallet Options */
            <div className="space-y-2">
              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md mb-2">
                  {error.message || "Failed to connect"}
                </div>
              )}

              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className={`w-full p-3 rounded-md flex items-center justify-between border`}
                >
                  <span>{connector.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}