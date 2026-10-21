// src/pages/admin/AdminFraud.jsx
import { useState } from 'react';
import { ShieldAlert, AlertTriangle, Check, Ban, Eye, Lock } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import { Table, Tr, Td } from '../../components/Table.jsx';

const MOCK_FRAUD_FLAGS = [
  { id: 'FLG-101', entity: 'User: rahul.d@test.com', type: 'Velocity Anomaly', details: '5 orders placed in 3 minutes from same device fingerprint', severity: 'high', status: 'investigating' },
  { id: 'FLG-102', entity: 'Store: Fresh Valley Baner', type: 'Abnormal Cancellation Rate', details: '40% order cancellations in last 4 hours', severity: 'medium', status: 'review_pending' },
  { id: 'FLG-103', entity: 'Courier: Vikram J.', type: 'Geo-Spoofing Suspicion', details: 'Instantaneous hop between 4 km coordinates', severity: 'critical', status: 'active_flag' },
  { id: 'FLG-104', entity: 'IP: 103.21.244.12', type: 'Promo Abuse', details: 'WELCOME50 redeemed 12 times with fresh pseudo accounts', severity: 'high', status: 'investigating' },
];

export default function AdminFraud() {
  const [flags, setFlags] = useState(MOCK_FRAUD_FLAGS);

  const handleAction = (id, action) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: action === 'block' ? 'blocked' : 'dismissed' } : f))
    );
    alert(`Flag #${id} action executed: ${action.toUpperCase()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>Fraud Prevention & Security Logs</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Automated heuristic anomaly detection flagging promotional abuse, suspicious velocities, and GPS spoofing
        </p>
      </div>

      <Card>
        <CardHeader title="Suspicious Activity Logs" subtitle="Rule-based threat indicators" />
        <Table headers={['Flag ID', 'Suspect Entity', 'Anomaly Type', 'Details', 'Severity', 'Status', 'Remediation']}>
          {flags.map((f) => (
            <Tr key={f.id}>
              <Td><strong>#{f.id}</strong></Td>
              <Td><strong>{f.entity}</strong></Td>
              <Td>{f.type}</Td>
              <Td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', maxWidth: '280px' }}>
                {f.details}
              </Td>
              <Td>
                <Badge
                  variant={
                    f.severity === 'critical' || f.severity === 'high'
                      ? 'error'
                      : f.severity === 'medium'
                      ? 'warning'
                      : 'neutral'
                  }
                >
                  {f.severity.toUpperCase()}
                </Badge>
              </Td>
              <Td>
                <Badge variant={f.status === 'blocked' ? 'error' : f.status === 'dismissed' ? 'success' : 'warning'}>
                  {f.status.toUpperCase()}
                </Badge>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {f.status !== 'blocked' && f.status !== 'dismissed' && (
                    <>
                      <Button variant="danger" size="sm" onClick={() => handleAction(f.id, 'block')}>
                        <Ban size={14} /> Block
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleAction(f.id, 'dismiss')}>
                        Dismiss
                      </Button>
                    </>
                  )}
                  {(f.status === 'blocked' || f.status === 'dismissed') && (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Resolved</span>
                  )}
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
