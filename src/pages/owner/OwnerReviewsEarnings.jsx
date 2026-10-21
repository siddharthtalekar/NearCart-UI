// src/pages/owner/OwnerReviewsEarnings.jsx
import { useState } from 'react';
import { Star, DollarSign, Download, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Tabs from '../../components/Tabs.jsx';
import Button from '../../components/Button.jsx';
import Rating from '../../components/Rating.jsx';
import { Table, Tr, Td } from '../../components/Table.jsx';
import { Badge } from '../../components/Badge.jsx';
import { formatCurrency } from '../../utils/helpers.js';

const MOCK_REVIEWS = [
  { id: 'rev_1', author: 'Pooja Sharma', rating: 5, date: 'Yesterday', text: 'Fresh vegetables and delivered within 25 minutes! Extremely courteous courier partner.', product: 'Amul Taaza Milk' },
  { id: 'rev_2', author: 'Rahul Deshmukh', rating: 4, date: '3 days ago', text: 'Good quality grains and packaging. Will order again from this Baner store.', product: 'Aashirvaad Atta' },
  { id: 'rev_3', author: 'Ananya Verma', rating: 5, date: '5 days ago', text: 'Loved the quick express delivery. Prices are the same as local retail counter.', product: 'Tata Salt' },
];

const MOCK_PAYOUTS = [
  { id: 'PAY-8921', period: '10 Oct - 16 Oct 2026', orders: 184, gross: 64200, commission: 3210, net: 60990, status: 'paid', date: '17 Oct 2026' },
  { id: 'PAY-8804', period: '03 Oct - 09 Oct 2026', orders: 162, gross: 55800, commission: 2790, net: 53010, status: 'paid', date: '10 Oct 2026' },
  { id: 'PAY-8711', period: '26 Sep - 02 Oct 2026', orders: 175, gross: 61400, commission: 3070, net: 58330, status: 'paid', date: '03 Oct 2026' },
];

export default function OwnerReviewsEarnings() {
  const [activeTab, setActiveTab] = useState('earnings');

  const tabs = [
    { id: 'earnings', label: 'Payouts & Earnings', icon: <DollarSign size={16} /> },
    { id: 'reviews', label: 'Customer Reviews (4.8 ★)', icon: <Star size={16} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Earnings & Customer Feedback</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Monitor your weekly merchant settlement deposits and customer satisfaction ratings
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'earnings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Next Settlement (Due Monday)
              </span>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)' }}>
                ₹24,850
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                Bank: HDFC Bank A/C ending in 4102
              </span>
            </div>

            <div style={{ padding: '20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Lifetime Net Payouts
              </span>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>
                ₹3,84,200
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 'bold' }}>
                100% on-time settlement
              </span>
            </div>

            <div style={{ padding: '20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Platform Commission Rate
              </span>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>
                5.0%
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                Hyperlocal merchant tier
              </span>
            </div>
          </div>

          <Card>
            <CardHeader title="Settlement History" subtitle="Direct bank deposits processed weekly" />
            <Table headers={['Payout ID', 'Settlement Period', 'Total Orders', 'Gross Volume', 'Fee (5%)', 'Net Deposited', 'Status']}>
              {MOCK_PAYOUTS.map((p) => (
                <Tr key={p.id}>
                  <Td><strong>#{p.id}</strong></Td>
                  <Td>{p.period}</Td>
                  <Td>{p.orders} orders</Td>
                  <Td>{formatCurrency(p.gross)}</Td>
                  <Td style={{ color: 'var(--color-error)' }}>-{formatCurrency(p.commission)}</Td>
                  <Td><strong>{formatCurrency(p.net)}</strong></Td>
                  <Td><Badge variant="success">DEPOSITED</Badge></Td>
                </Tr>
              ))}
            </Table>
          </Card>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {MOCK_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              style={{
                padding: '20px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{rev.author}</strong>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    Purchased: {rev.product}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Rating value={rev.rating} />
                  <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{rev.date}</div>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: '1.5' }}>
                "{rev.text}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
