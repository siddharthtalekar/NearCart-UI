// src/pages/owner/OwnerOrders.jsx
import { useState, useEffect } from 'react';
import { ClipboardList, Check, X, Clock, Bike, CheckCircle2, AlertCircle, Eye, Phone } from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import Modal from '../../components/Modal.jsx';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

const STATUS_COLUMNS = [
  { key: 'placed', label: 'New Orders', color: 'primary' },
  { key: 'accepted', label: 'Accepted', color: 'info' },
  { key: 'preparing', label: 'Preparing', color: 'warning' },
  { key: 'in_transit', label: 'Out for Delivery', color: 'accent' },
  { key: 'delivered', label: 'Completed', color: 'success' },
];

export default function OwnerOrders() {
  const storeId = 's1';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected order for detail drawer/modal
  const [activeOrder, setActiveOrder] = useState(null);
  const [rejectModalOrder, setRejectModalOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('Out of stock for key items');

  useEffect(() => {
    loadOrders();
  }, [storeId]);

  const loadOrders = async () => {
    setLoading(true);
    const data = await orderService.getStoreOrders(storeId);
    setOrders(data);
    setLoading(false);
  };

  const handleAccept = async (orderId) => {
    await orderService.respondToOrder(orderId, 'accept');
    loadOrders();
  };

  const handleRejectConfirm = async () => {
    if (!rejectModalOrder) return;
    await orderService.respondToOrder(rejectModalOrder.id, 'reject', rejectReason);
    setRejectModalOrder(null);
    loadOrders();
  };

  const handleUpdateStatus = async (orderId, newStatus, note) => {
    await orderService.updateOrderStatus(orderId, newStatus, note);
    loadOrders();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Incoming Orders Board</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Manage real-time incoming orders, preparation stages, and dispatch to courier partners
        </p>
      </div>

      {/* Kanban Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'start' }}>
        {STATUS_COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);

          return (
            <div
              key={col.key}
              style={{
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-xl)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '400px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{col.label}</span>
                <span style={{ fontSize: 'var(--text-xs)', background: 'var(--color-surface)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 'bold' }}>
                  {colOrders.length}
                </span>
              </div>

              {colOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px',
                    boxShadow: 'var(--shadow-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: 'var(--text-sm)' }}>#{order.id}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                        {formatDate(order.placedAt)}
                      </div>
                    </div>
                    <strong style={{ color: 'var(--color-primary)' }}>
                      {formatCurrency(order.pricing?.total)}
                    </strong>
                  </div>

                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    Customer: <strong>{order.customerName}</strong> ({order.customerPhone})
                  </div>

                  {/* Items summary */}
                  <div style={{ padding: '8px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', fontSize: '11px' }}>
                    {order.items?.map((it, idx) => (
                      <div key={idx}>• {it.qty}x {it.name}</div>
                    ))}
                  </div>

                  {/* Delivery Partner status */}
                  <div style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)' }}>
                    <Bike size={13} color="var(--color-primary)" />
                    <span>
                      {order.deliveryPartnerName ? (
                        <>Courier: <strong>{order.deliveryPartnerName}</strong></>
                      ) : (
                        <em>Courier pending assignment</em>
                      )}
                    </span>
                  </div>

                  {/* Stage action buttons */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    {order.status === 'placed' && (
                      <>
                        <Button variant="primary" size="sm" fullWidth onClick={() => handleAccept(order.id)}>
                          <Check size={14} /> Accept
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setRejectModalOrder(order)}>
                          <X size={14} />
                        </Button>
                      </>
                    )}

                    {order.status === 'accepted' && (
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => handleUpdateStatus(order.id, 'preparing', 'Store is packing order')}
                      >
                        Start Packing
                      </Button>
                    )}

                    {order.status === 'preparing' && (
                      <Button
                        variant="accent"
                        size="sm"
                        fullWidth
                        onClick={() => handleUpdateStatus(order.id, 'in_transit', 'Ready and picked up by courier')}
                      >
                        Mark Ready for Courier
                      </Button>
                    )}

                    <Button variant="ghost" size="sm" onClick={() => setActiveOrder(order)}>
                      <Eye size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Reject Modal */}
      {rejectModalOrder && (
        <Modal
          isOpen={!!rejectModalOrder}
          onClose={() => setRejectModalOrder(null)}
          title={`Reject Order #${rejectModalOrder.id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Please specify the reason for rejecting this order so the customer is notified:
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
              <option value="Out of stock for key items">Out of stock for key items</option>
              <option value="Store closing early today">Store closing early today</option>
              <option value="Delivery address out of service area">Delivery address out of service area</option>
              <option value="Unforeseen kitchen/store rush">Unforeseen kitchen/store rush</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button variant="ghost" onClick={() => setRejectModalOrder(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleRejectConfirm}>Confirm Rejection</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Detail Modal */}
      {activeOrder && (
        <Modal
          isOpen={!!activeOrder}
          onClose={() => setActiveOrder(null)}
          title={`Order Details #${activeOrder.id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--text-sm)' }}>
            <div>
              <strong>Customer:</strong> {activeOrder.customerName} ({activeOrder.customerPhone})
            </div>
            <div>
              <strong>Delivery Address:</strong> {activeOrder.deliveryAddress}
            </div>
            {activeOrder.deliveryNotes && (
              <div>
                <strong>Instructions:</strong> {activeOrder.deliveryNotes}
              </div>
            )}
            <div>
              <strong>Payment Status:</strong> {activeOrder.payment?.method?.toUpperCase()} ({activeOrder.payment?.status})
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
              <strong>Items to pack:</strong>
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeOrder.items?.map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{it.qty}x {it.name} ({it.size || ''})</span>
                    <span>{formatCurrency(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '10px', fontWeight: 'bold' }}>
              <span>Total Value:</span>
              <span>{formatCurrency(activeOrder.pricing?.total)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
