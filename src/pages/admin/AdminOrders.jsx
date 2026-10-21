// src/pages/admin/AdminOrders.jsx
import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Eye, Clock, Store, Bike, MapPin } from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import Modal from '../../components/Modal.jsx';
import { Table, Tr, Td } from '../../components/Table.jsx';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    orderService.getAllOrders().then(setOrders);
  }, []);

  const filtered = orders.filter((o) => {
    const matchStatus = !statusFilter || o.status === statusFilter;
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.storeName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>All Platform Orders Monitor</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Real-time oversight of customer purchases, merchant fulfillment, and courier dispatches
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 12px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--color-text-tertiary)" />
          <input
            type="text"
            placeholder="Search by order ID, customer, or store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', padding: '10px 0', outline: 'none' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          <option value="">All Statuses</option>
          <option value="placed">Placed</option>
          <option value="accepted">Accepted</option>
          <option value="preparing">Preparing</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <Card>
        <Table headers={['Order ID', 'Store', 'Customer', 'Placed At', 'Total Paid', 'Live Status', 'Inspection']}>
          {filtered.map((o) => (
            <Tr key={o.id}>
              <Td><strong>#{o.id}</strong></Td>
              <Td>{o.storeName}</Td>
              <Td>
                <div>{o.customerName}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{o.customerPhone}</div>
              </Td>
              <Td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {formatDate(o.placedAt)}
              </Td>
              <Td><strong>{formatCurrency(o.pricing?.total)}</strong></Td>
              <Td>
                <Badge
                  variant={
                    o.status === 'delivered'
                      ? 'success'
                      : ['cancelled', 'rejected', 'failed'].includes(o.status)
                      ? 'error'
                      : 'primary'
                  }
                >
                  {o.status.toUpperCase()}
                </Badge>
              </Td>
              <Td>
                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(o)}>
                  <Eye size={14} /> View Details
                </Button>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      {/* Order Detail Drawer Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Detailed Audit: Order #${selectedOrder.id}`}
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: 'var(--text-sm)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong>Customer:</strong> {selectedOrder.customerName}
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{selectedOrder.customerPhone}</div>
              </div>
              <div>
                <strong>Store:</strong> {selectedOrder.storeName}
              </div>
            </div>

            <div>
              <strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}
            </div>

            <div>
              <strong>Assigned Courier Partner:</strong>{' '}
              {selectedOrder.deliveryPartnerName ? (
                <span>{selectedOrder.deliveryPartnerName} ({selectedOrder.deliveryPartnerPhone || 'Active'})</span>
              ) : (
                <span style={{ color: 'var(--color-warning)' }}>Unassigned / Self-Pickup</span>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
              <strong>Itemized Order Contents:</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{it.qty}x {it.name} ({it.size || ''})</span>
                    <span>{formatCurrency(it.subtotal || it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '10px', fontWeight: 'bold' }}>
              <span>Total Price (Taxes & Fees included):</span>
              <span>{formatCurrency(selectedOrder.pricing?.total)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button variant="primary" onClick={() => setSelectedOrder(null)}>Done</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
