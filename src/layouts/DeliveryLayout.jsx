// src/layouts/DeliveryLayout.jsx
import DashboardLayout from './DashboardLayout.jsx';
import { LayoutDashboard, MapPin, History, DollarSign } from 'lucide-react';

const deliveryNav = [
  { to: '/delivery', end: true, icon: <LayoutDashboard size={18}/>, label: 'Dashboard' },
  { to: '/delivery/active', icon: <MapPin size={18}/>, label: 'Active Delivery' },
  { to: '/delivery/history', icon: <History size={18}/>, label: 'Delivery History' },
  { to: '/delivery/earnings', icon: <DollarSign size={18}/>, label: 'Earnings' },
];

export default function DeliveryLayout() {
  return <DashboardLayout navItems={deliveryNav} brandLabel="Delivery" brandIcon="🛵" />;
}
