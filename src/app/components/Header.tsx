"use client";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faSearch, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import Button from '../shared/Button';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/lib/store';
import MobileMenu from './MobileMenu';

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const cartItemCount = useSelector((state: AppState) => state.cart.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navLinks = [
    { href: '/shop/female', label: t('navigation.female') },
    { href: '/shop/male', label: t('navigation.male') },
    { href: '/shop/unisex', label: t('navigation.unisex') },
    { href: '/shop/all', label: t('navigation.shop') },
  ];

  return (
    <header className="w-full border-b border-gray-200 bg-white fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-3xl font-logo tracking-wide select-none leading-tight md:leading-normal">
          {t('navigation.logo')}
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center flex-1 justify-center">
          <Link href="/" className={`text-gray-400 font-medium hover:text-black transition${pathname === '/' ? ' font-bold text-black' : ''}`}>{t('navigation.home')}</Link>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? 'font-bold text-primary-600 underline underline-offset-4'
                  : 'text-black font-medium hover:text-gray-600 transition'
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Icons */}
        <div className="flex items-center gap-0.5 md:gap-2">
          {/* Cart */}
          <div className="relative">
            <Link href="/cart">
              <Button 
                icon={<FontAwesomeIcon icon={faShoppingBag} className="w-6 h-6 text-black" />} 
                variant='ghost' 
                label={t('navigation.cart')} 
                className="rounded-full" 
                iconOnly={true} 
              />
            </Link>
            {isClient && cartItemCount > 0 && (
              <span className="absolute top-1 left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </div>

          {/* Search */}
          <Button icon={<FontAwesomeIcon icon={faSearch}  className="w-6 h-6 text-black" />} variant='ghost' className="rounded-full" iconOnly={true} />
          {/* Avatar */}
          <Link href="/profile">
            <Button icon={<FontAwesomeIcon icon={faUser}  className="w-6 h-6 text-black" />} variant='ghost' label={t('navigation.account')} className="rounded-full" iconOnly={true} />
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <FontAwesomeIcon icon={faBars} className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}

// Add this font to your Tailwind config for 'font-logo' if you want a script style logo. 