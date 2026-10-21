// src/layouts/AdminLayout.jsx
import DashboardLayout from './DashboardLayout.jsx';
import { LayoutDashboard, CheckSquare, Users, Layers, ShoppingBag, AlertTriangle, ShieldAlert, Settings } from 'lucide-react';

const adminNav = [
  { to: '/admin', end: true, icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/approvals', icon: <CheckSquare size={18} />, label: 'Approvals' },
  { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
  { to: '/admin/categories', icon: <Layers size={18} />, label: 'Categories' },
  { to: '/admin/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
  { to: '/admin/disputes', icon: <AlertTriangle size={18} />, label: 'Disputes' },
  { to: '/admin/fraud', icon: <ShieldAlert size={18} />, label: 'Fraud Flags' },
  { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
];

export default function AdminLayout() {
  return <DashboardLayout navItems={adminNav} brandLabel="Admin" brandIcon="⚡" />;
}
