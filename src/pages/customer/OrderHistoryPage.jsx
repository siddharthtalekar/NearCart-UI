// src/pages/customer/OrderHistoryPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Search, Filter, Receipt, AlertCircle, RefreshCw, Eye, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { orderService } from '../../services/orderService.js';
import { useCart } from '../../context/CartContext.jsx';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import Modal from '../../components/Modal.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatCurrency, formatDate } from '../../utils/helpers.js';
import styles from './OrderHistoryPage.module.css';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [disputeOrder, setDisputeOrder] = useState(null);
  const [disputeReason, setDisputeReason] = useState('Missing or incorrect items');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    orderService
      .getCustomerOrders(user?.id || 'u1', {
        status: statusFilter === 'all' ? undefined : statusFilter,
      })
      .then((data) => {
        if (mounted) {
          setOrders(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [user?.id, statusFilter]);

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        addItem(
          {
            id: item.productId,
            name: item.name,
            brand: item.brand,
            size: item.size,
            price: item.price,
            stock: 20,
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300',
            storeId: order.storeId,
          },
          item.qty
        );
      });
      navigate('/customer/cart');
    }
  };

  const handleRaiseDispute = () => {
    setDisputeSubmitted(true);
    setTimeout(() => {
      setDisputeSubmitted(false);
      setDisputeOrder(null);
      setDisputeNotes('');
      alert('Dispute ticket submitted. An Admin will review and contact you shortly.');
    }, 1200);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Order History</h1>
          <p className={styles.subtitle}>Track past and active purchases from nearby stores</p>
        </div>

        {/* Filter */}
        <div className={styles.filterWrap}>
          <Filter size={16} color="var(--color-text-tertiary)" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.statusSelect}
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.orderList}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="160px" style={{ borderRadius: '16px' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package size={50} />}
          title="No orders found"
          description="You haven't placed any orders matching this criteria yet."
          actionLabel="Start Shopping"
          action={() => navigate('/customer')}
        />
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.cardTop}>
                <div className={styles.storeInfo}>
                  <h3 className={styles.storeName}>{order.storeName}</h3>
                  <span className={styles.orderMeta}>
                    #{order.id} • {formatDate(order.placedAt)}
                  </span>
                </div>

                <div className={styles.topRight}>
                  <Badge
                    variant={
                      order.status === 'delivered'
                        ? 'success'
                        : ['cancelled', 'rejected', 'failed'].includes(order.status)
                        ? 'error'
                        : 'primary'
                    }
                  >
                    {order.status.toUpperCase().replace('_', ' ')}
                  </Badge>
                  <span className={styles.totalAmount}>
                    {formatCurrency(order.pricing?.total)}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className={styles.itemsSummary}>
                {order.items?.map((item, idx) => (
                  <span key={idx} className={styles.itemTag}>
                    {item.qty}x {item.name}
                  </span>
                ))}
              </div>

              <div className={styles.cardActions}>
                <div className={styles.leftActions}>
                  <Link to={`/customer/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye size={14} /> Live Tracking
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInvoiceOrder(order)}
                  >
                    <Receipt size={14} /> Invoice View
                  </Button>
                </div>

                <div className={styles.rightActions}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDisputeOrder(order)}
                    style={{ color: 'var(--color-error)' }}
                  >
                    <AlertCircle size={14} /> Report Issue
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleReorder(order)}
                  >
                    <RefreshCw size={14} /> Reorder
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceOrder && (
        <Modal
          isOpen={!!invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
          title={`Tax Invoice #${invoiceOrder.id}`}
          size="md"
        >
          <div className={styles.invoiceModal}>
            <div className={styles.invHeader}>
              <div>
                <h2>NearCart Hyperlocal Tax Invoice</h2>
                <p>Fulfilled by: <strong>{invoiceOrder.storeName}</strong></p>
                <p>Delivery: {invoiceOrder.deliveryAddress}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p>Date: {formatDate(invoiceOrder.placedAt)}</p>
                <p>Status: {invoiceOrder.payment?.status?.toUpperCase() || 'PAID'}</p>
              </div>
            </div>

            <div className={styles.invTableWrap}>
              <table className={styles.invTable}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceOrder.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td>{it.name} ({it.size || ''})</td>
                      <td>{it.qty}</td>
                      <td>{formatCurrency(it.price)}</td>
                      <td>{formatCurrency(it.subtotal || it.price * it.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.invTotals}>
              <div>Subtotal: {formatCurrency(invoiceOrder.pricing?.subtotal)}</div>
              <div>Delivery Fee: {formatCurrency(invoiceOrder.pricing?.deliveryFee)}</div>
              <div>Platform Fee: {formatCurrency(invoiceOrder.pricing?.platformFee)}</div>
              <div>GST / Taxes (5%): {formatCurrency(invoiceOrder.pricing?.taxes)}</div>
              {invoiceOrder.pricing?.discount > 0 && (
                <div style={{ color: 'var(--color-success)' }}>Discount: -{formatCurrency(invoiceOrder.pricing?.discount)}</div>
              )}
              <div className={styles.invGrand}>
                Grand Total: {formatCurrency(invoiceOrder.pricing?.total)}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button variant="primary" onClick={() => window.print()}>
                Print Receipt
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Raise Dispute Modal */}
      {disputeOrder && (
        <Modal
          isOpen={!!disputeOrder}
          onClose={() => setDisputeOrder(null)}
          title={`Report Issue / Dispute on Order #${disputeOrder.id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Reason for Issue</label>
            <select
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
              }}
            >
              <option value="Missing or incorrect items">Missing or incorrect items</option>
              <option value="Damaged or spoiled packaging">Damaged or spoiled packaging</option>
              <option value="Delivery partner misconduct">Delivery partner misconduct</option>
              <option value="Charged incorrect amount">Charged incorrect amount</option>
            </select>

            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Additional Details</label>
            <textarea
              rows={3}
              placeholder="Describe what went wrong..."
              value={disputeNotes}
              onChange={(e) => setDisputeNotes(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                fontFamily: 'inherit',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <Button variant="ghost" onClick={() => setDisputeOrder(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={disputeSubmitted}
                onClick={handleRaiseDispute}
              >
                Submit Dispute
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
