// src/layouts/OwnerLayout.jsx
import DashboardLayout from './DashboardLayout.jsx';
import { LayoutDashboard, Package, Tag, ClipboardList, Store, Star, DollarSign } from 'lucide-react';

const ownerNav = [
  { to: '/owner', end: true, icon: <LayoutDashboard size={18}/>, label: 'Dashboard' },
  { to: '/owner/orders', icon: <ClipboardList size={18}/>, label: 'Orders', badge: null },
  { to: '/owner/products', icon: <Package size={18}/>, label: 'Products' },
  { to: '/owner/offers', icon: <Tag size={18}/>, label: 'Offers' },
  { to: '/owner/store', icon: <Store size={18}/>, label: 'Store Profile' },
  { to: '/owner/reviews', icon: <Star size={18}/>, label: 'Reviews' },
  { to: '/owner/earnings', icon: <DollarSign size={18}/>, label: 'Earnings' },
];

export default function OwnerLayout() {
  return <DashboardLayout navItems={ownerNav} brandLabel="Owner" brandIcon="🏪" />;
}
