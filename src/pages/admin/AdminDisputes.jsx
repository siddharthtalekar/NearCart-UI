// src/pages/admin/AdminDisputes.jsx
import { useState } from 'react';
import { AlertCircle, CheckCircle2, MessageSquare, DollarSign, CornerUpRight } from 'lucide-react';
import { mockDisputes } from '../../data/orders.js';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import Modal from '../../components/Modal.jsx';
import { Table, Tr, Td } from '../../components/Table.jsx';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

export default function AdminDisputes() {
  const [disputesList, setDisputesList] = useState(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const handleResolve = (actionType) => {
    if (!selectedDispute) return;
    setDisputesList((prev) =>
      prev.map((d) =>
        d.id === selectedDispute.id
          ? {
              ...d,
              status: actionType === 'refund' ? 'refunded' : actionType === 'escalate' ? 'escalated' : 'resolved',
              resolutionNote: adminNote || `Action applied: ${actionType.toUpperCase()}`,
            }
      : d
      )
    );
    setSelectedDispute(null);
    setAdminNote('');
    alert(`Dispute ${selectedDispute.id} updated with action: ${actionType.toUpperCase()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>Customer Dispute Escalation Center</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Arbitrate and resolve order issues between customers, merchants, and courier partners
        </p>
      </div>

      <Card>
        <CardHeader title="All Reported Customer Disputes" subtitle="Orders with issues reported" />
        <Table headers={['Ticket ID', 'Order ID', 'Customer', 'Reported Reason', 'Date Filed', 'Status', 'Resolution']}>
          {disputesList.map((d) => (
            <Tr key={d.id}>
              <Td><strong>#{d.id}</strong></Td>
              <Td style={{ fontFamily: 'var(--font-mono)' }}>{d.orderId}</Td>
              <Td>{d.customerName}</Td>
              <Td>
                <div style={{ fontWeight: 'bold' }}>{d.reason}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{d.description}</div>
              </Td>
              <Td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {formatDate(d.createdAt)}
              </Td>
              <Td>
                <Badge
                  variant={
                    d.status === 'resolved' || d.status === 'refunded'
                      ? 'success'
                      : d.status === 'escalated'
                      ? 'error'
                      : 'warning'
                  }
                >
                  {d.status.toUpperCase()}
                </Badge>
              </Td>
              <Td>
                <Button variant="outline" size="sm" onClick={() => setSelectedDispute(d)}>
                  <MessageSquare size={14} /> Arbitrate Ticket
                </Button>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      {/* Arbitrate Dispute Modal */}
      {selectedDispute && (
        <Modal
          isOpen={!!selectedDispute}
          onClose={() => setSelectedDispute(null)}
          title={`Dispute Ticket #${selectedDispute.id}`}
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: 'var(--text-sm)' }}>
            <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div><strong>Related Order:</strong> #{selectedDispute.orderId}</div>
              <div><strong>Customer Claim:</strong> {selectedDispute.reason}</div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                "{selectedDispute.description}"
              </p>
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Admin Resolution Note
              </label>
              <textarea
                rows={3}
                placeholder="Enter notes on findings, refund reference, or investigation..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
              <Button variant="ghost" onClick={() => setSelectedDispute(null)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => handleResolve('escalate')}>
                <CornerUpRight size={14} /> Escalate to Legal
              </Button>
              <Button variant="primary" onClick={() => handleResolve('resolve')}>
                <CheckCircle2 size={14} /> Mark Resolved
              </Button>
              <Button variant="danger" onClick={() => handleResolve('refund')}>
                <DollarSign size={14} /> Issue Full Refund
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
