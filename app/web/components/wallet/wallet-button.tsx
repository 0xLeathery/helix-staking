"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function WalletButton() {
  const { publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const truncatedAddress = useMemo(() => {
    if (!publicKey) return null;
    const base58 = publicKey.toBase58();
    return `${base58.slice(0, 4)}...${base58.slice(-4)}`;
  }, [publicKey]);

  const handleClick = useCallback(() => {
    if (publicKey) {
      setShowDropdown((prev) => !prev);
    } else {
      setVisible(true);
    }
  }, [publicKey, setVisible]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setShowDropdown(false);
  }, [disconnect]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        onClick={handleClick}
        variant={publicKey ? "outline" : "default"}
        disabled={connecting}
      >
        {connecting
          ? "Connecting..."
          : publicKey
            ? truncatedAddress
            : "Connect Wallet"}
      </Button>

      {showDropdown && publicKey && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-lg z-50">
          <button
            onClick={handleDisconnect}
            className="block w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
