// src/pages/admin/AdminApprovals.jsx
import { useState, useEffect } from 'react';
import { Check, X, Eye, Store, Bike, FileText, CheckCircle2 } from 'lucide-react';
import { storeService } from '../../services/storeService.js';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import Modal from '../../components/Modal.jsx';
import { Table, Tr, Td } from '../../components/Table.jsx';
import Tabs from '../../components/Tabs.jsx';

const MOCK_PARTNER_APPROVALS = [
  { id: 'part_1', name: 'Vikram Joshi', phone: '9822019283', vehicle: 'Honda Shine (MH 12 CD 4921)', dl: 'DL-MH12-20210084', submittedAt: 'Yesterday' },
  { id: 'part_2', name: 'Ramesh Kale', phone: '9765412390', vehicle: 'TVS Jupiter (MH 12 EQ 1928)', dl: 'DL-MH12-20220011', submittedAt: '2 days ago' },
];

export default function AdminApprovals() {
  const [activeTab, setActiveTab] = useState('stores');
  const [stores, setStores] = useState([]);
  const [partnerApprovals, setPartnerApprovals] = useState(MOCK_PARTNER_APPROVALS);

  // Reject Modal
  const [rejectItem, setRejectItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('Incomplete FSSAI or Business License documents');

  // Preview Doc Modal
  const [docPreview, setDocPreview] = useState(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    const all = await storeService.getAllStores();
    setStores(all);
  };

  const pendingStores = stores.filter((s) => s.status === 'pending');

  const handleApproveStore = async (storeId) => {
    await storeService.setStoreStatus(storeId, 'approved');
    loadStores();
  };

  const handleRejectStoreConfirm = async () => {
    if (!rejectItem) return;
    if (rejectItem.type === 'store') {
      await storeService.setStoreStatus(rejectItem.id, 'rejected', rejectReason);
      loadStores();
    } else {
      setPartnerApprovals((prev) => prev.filter((p) => p.id !== rejectItem.id));
    }
    setRejectItem(null);
  };

  const handleApprovePartner = (id) => {
    setPartnerApprovals((prev) => prev.filter((p) => p.id !== id));
    alert('Courier partner verified and activated successfully.');
  };

  const tabs = [
    { id: 'stores', label: 'Store Registrations', badge: pendingStores.length },
    { id: 'partners', label: 'Delivery Courier KYC', badge: partnerApprovals.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>Merchant & Partner Approvals Queue</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Review business credentials, FSSAI certificates, and driver licenses before activating onto the platform
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'stores' && (
        <Card>
          <CardHeader title="Pending Store Applications" subtitle="Awaiting administrative review" />
          {pendingStores.length === 0 ? (
            <CardBody style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
              No stores currently pending approval. All merchants verified!
            </CardBody>
          ) : (
            <Table headers={['Store Name', 'Category', 'Address / Area', 'Submitted Documents', 'Actions']}>
              {pendingStores.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    <div style={{ fontWeight: 'bold' }}>{s.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>ID: #{s.id}</div>
                  </Td>
                  <Td><Badge variant="primary">{s.category}</Badge></Td>
                  <Td>{s.address || s.area}</Td>
                  <Td>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDocPreview({ title: `${s.name} - Documents`, docs: ['FSSAI License PDF', 'GSTIN Certificate PDF', 'Shop Act License'] })}
                    >
                      <Eye size={14} /> View Docs (3)
                    </Button>
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="primary" size="sm" onClick={() => handleApproveStore(s.id)}>
                        <Check size={14} /> Approve
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setRejectItem({ id: s.id, type: 'store', name: s.name })}>
                        <X size={14} /> Reject
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Table>
          )}
        </Card>
      )}

      {activeTab === 'partners' && (
        <Card>
          <CardHeader title="Pending Delivery Courier Approvals" subtitle="Driver license and vehicle documentation" />
          <Table headers={['Partner Name', 'Phone', 'Vehicle Details', 'License No.', 'Actions']}>
            {partnerApprovals.map((p) => (
              <Tr key={p.id}>
                <Td><strong>{p.name}</strong></Td>
                <Td>{p.phone}</Td>
                <Td>{p.vehicle}</Td>
                <Td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{p.dl}</Td>
                <Td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="primary" size="sm" onClick={() => handleApprovePartner(p.id)}>
                      <Check size={14} /> Verify & Approve
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setRejectItem({ id: p.id, type: 'partner', name: p.name })}>
                      <X size={14} /> Reject
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Reject Reason Modal */}
      {rejectItem && (
        <Modal
          isOpen={!!rejectItem}
          onClose={() => setRejectItem(null)}
          title={`Reject Application for ${rejectItem.name}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Provide a clear reason for rejecting this application so the applicant can correct their submission:
            </p>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
              }}
            >
              <option value="Incomplete FSSAI or Business License documents">Incomplete FSSAI or Business License documents</option>
              <option value="Blurry or unreadable document scans">Blurry or unreadable document scans</option>
              <option value="Location out of platform operational coverage">Location out of platform operational coverage</option>
              <option value="Duplicate store or partner account detected">Duplicate store or partner account detected</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <Button variant="ghost" onClick={() => setRejectItem(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleRejectConfirm}>Confirm Rejection</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Doc Preview Modal */}
      {docPreview && (
        <Modal
          isOpen={!!docPreview}
          onClose={() => setDocPreview(null)}
          title={docPreview.title}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {docPreview.docs?.map((doc, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="var(--color-primary)" />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>{doc}</span>
                </div>
                <Badge variant="success">Verified Authentic</Badge>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button variant="primary" onClick={() => setDocPreview(null)}>Done</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
