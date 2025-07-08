import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faSearch, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import Button from '../shared/Button';


export default function Header() {
  const t = useTranslations();
  return (
    <header className="w-full border-b border-gray-200 bg-white fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="text-3xl font-logo tracking-wide select-none">
          {t('navigation.logo')}
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center flex-1 justify-center">
          <Link href="/" className="text-gray-400 font-medium hover:text-black transition">{t('navigation.home')}</Link>
          <Link href="/female" className="text-black font-medium hover:text-gray-600 transition">{t('navigation.female')}</Link>
          <Link href="/male" className="text-black font-medium hover:text-gray-600 transition">{t('navigation.male')}</Link>
          <Link href="/unisex" className="text-black font-medium hover:text-gray-600 transition">{t('navigation.unisex')}</Link>
          <Link href="/shop" className="text-black font-medium hover:text-gray-600 transition">{t('navigation.shop')}</Link>
        </nav>
        {/* Icons */}
        <div className="flex items-center gap-2">
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