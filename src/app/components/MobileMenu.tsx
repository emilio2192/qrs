"use client";
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations();
  const pathname = usePathname();
  const navLinks = [
    { href: '/', label: t('navigation.home') },
    { href: '/shop/female', label: t('navigation.female') },
    { href: '/shop/male', label: t('navigation.male') },
    { href: '/shop/unisex', label: t('navigation.unisex') },
    { href: '/shop/all', label: t('navigation.shop') },
    { href: '/cart', label: t('navigation.cart') },
    { href: '/profile', label: t('navigation.account') },
  ];
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end md:hidden">
      <div ref={menuRef} className="w-64 bg-white h-full shadow-lg p-6 flex flex-col gap-4 animate-slide-in">
        <button onClick={onClose} className="self-end text-gray-500 hover:text-black text-2xl mb-2">×</button>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`block py-2 px-2 rounded text-lg font-medium ${pathname === link.href ? 'bg-gray-100 text-black font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.2s ease;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
} 