"use client";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faSearch, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import Button from '../shared/Button';
import { usePathname } from 'next/navigation';

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();

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
        <div className="flex items-center gap-1 md:gap-2">
          {/* Cart */}
          <Button icon={<FontAwesomeIcon icon={faShoppingBag}  className="w-6 h-6 text-black" />} variant='ghost' label={t('navigation.cart')} className="rounded-full" iconOnly={true} />

          {/* Search */}
          <Button icon={<FontAwesomeIcon icon={faSearch}  className="w-6 h-6 text-black" />} variant='ghost' className="rounded-full" iconOnly={true} />
          {/* Avatar */}
          <Button icon={<FontAwesomeIcon icon={faUser}  className="w-6 h-6 text-black" />} variant='ghost' label={t('navigation.account')} className="rounded-full" iconOnly={true} />

          {/* Hamburger (mobile only) */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FontAwesomeIcon icon={faBars} className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>
    </header>
  );
}

// Add this font to your Tailwind config for 'font-logo' if you want a script style logo. 