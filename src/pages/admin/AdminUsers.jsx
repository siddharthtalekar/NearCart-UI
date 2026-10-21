// src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { Users, Search, Filter, ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { authService } from '../../services/authService.js';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import { Table, Tr, Td } from '../../components/Table.jsx';
import { formatDate } from '../../utils/helpers.js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await authService.getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    await authService.setUserStatus(user.id, nextStatus);
    loadUsers();
  };

  const filtered = users.filter((u) => {
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>User & Account Management</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Manage customer, merchant, and delivery partner platform accounts and access states
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 12px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--color-text-tertiary)" />
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', padding: '10px 0', outline: 'none' }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="owner">Shop Owner</option>
          <option value="delivery">Delivery Courier</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Card>
        <Table headers={['User', 'Role', 'Phone', 'Created', 'Status', 'Account Actions']}>
          {filtered.map((u) => (
            <Tr key={u.id}>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{u.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{u.email}</div>
              </Td>
              <Td>
                <Badge
                  variant={
                    u.role === 'admin'
                      ? 'accent'
                      : u.role === 'owner'
                      ? 'warning'
                      : u.role === 'delivery'
                      ? 'info'
                      : 'neutral'
                  }
                >
                  {u.role.toUpperCase()}
                </Badge>
              </Td>
              <Td>{u.phone || '—'}</Td>
              <Td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {formatDate(u.createdAt)}
              </Td>
              <Td>
                <Badge variant={u.status === 'active' ? 'success' : 'error'}>
                  {u.status.toUpperCase()}
                </Badge>
              </Td>
              <Td>
                {u.role !== 'admin' && (
                  <Button
                    variant={u.status === 'active' ? 'danger' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleStatus(u)}
                  >
                    {u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
