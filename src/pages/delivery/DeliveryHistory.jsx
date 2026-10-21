// src/pages/delivery/DeliveryHistory.jsx
import { useState } from 'react';
import { History, DollarSign, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Tabs from '../../components/Tabs.jsx';
import { Table, Tr, Td } from '../../components/Table.jsx';
import { Badge } from '../../components/Badge.jsx';
import { formatCurrency } from '../../utils/helpers.js';

const MOCK_PAST_DELIVERIES = [
  { id: 'ORD-2610-180', store: 'Pune Daily Mart', drop: 'Balewadi High St', distance: '1.8 km', payout: 60, time: 'Today, 2:15 PM' },
  { id: 'ORD-2610-176', store: 'Wellness Medico', drop: 'Aundh Gaon', distance: '3.2 km', payout: 75, time: 'Today, 11:30 AM' },
  { id: 'ORD-2610-169', store: 'Bakers Pride', drop: 'Baner Road', distance: '1.2 km', payout: 50, time: 'Yesterday, 6:40 PM' },
  { id: 'ORD-2610-154', store: 'Green Valley Organics', drop: 'Pashan Sus Rd', distance: '4.1 km', payout: 90, time: 'Yesterday, 3:20 PM' },
];

export default function DeliveryHistory() {
  const [activeTab, setActiveTab] = useState('history');

  const tabs = [
    { id: 'history', label: 'Delivery Trips', icon: <History size={16} /> },
    { id: 'earnings', label: 'Payout Summary', icon: <DollarSign size={16} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>Courier Trips & Earnings</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Review completed orders, distance milestones, and daily payout balances
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'history' && (
        <Card>
          <CardHeader title="Completed Delivery Trips" subtitle="All delivered orders" />
          <Table headers={['Order ID', 'Store', 'Destination', 'Trip Distance', 'Payout Earned', 'Delivered At']}>
            {MOCK_PAST_DELIVERIES.map((d) => (
              <Tr key={d.id}>
                <Td><strong>#{d.id}</strong></Td>
                <Td>{d.store}</Td>
                <Td>{d.drop}</Td>
                <Td>{d.distance}</Td>
                <Td><strong style={{ color: 'var(--color-primary)' }}>{formatCurrency(d.payout)}</strong></Td>
                <Td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{d.time}</Td>
              </Tr>
            ))}
          </Table>
        </Card>
      )}

      {activeTab === 'earnings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                This Week's Net Total
              </span>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                ₹5,420
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                78 trips completed
              </span>
            </div>

            <div style={{ padding: '20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Incentives & Tips
              </span>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-accent-600)' }}>
                ₹650
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 'bold' }}>
                Peak hour surge bonus
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
