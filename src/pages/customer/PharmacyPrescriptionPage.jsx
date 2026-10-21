// src/pages/customer/PharmacyPrescriptionPage.jsx — Pharmacy Prescription Upload & Medicine Order Tracking
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Clock,
  Phone,
  Store,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Truck,
  Plus,
  Eye,
  Trash2,
  Sparkles,
  MapPin,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import PrescriptionUploadModal from '../../components/PrescriptionUploadModal.jsx';
import { prescriptionService, SAMPLE_PRESCRIPTIONS } from '../../services/prescriptionService.js';
import { mockStores } from '../../data/stores.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';
import styles from './PharmacyPrescriptionPage.module.css';

export default function PharmacyPrescriptionPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewModalImg, setPreviewModalImg] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const pharmacyStores = mockStores.filter((s) => s.category === 'pharmacy');

  const loadData = () => {
    const list = prescriptionService.getPrescriptions();
    setOrders(list);
    if (!selectedOrder && list.length > 0) {
      setSelectedOrder(list[0]);
    } else if (selectedOrder) {
      const refreshed = list.find((o) => o.id === selectedOrder.id) || list[0];
      setSelectedOrder(refreshed);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCancelOrder = (id) => {
    if (window.confirm('Are you sure you want to cancel this prescription order?')) {
      prescriptionService.cancelPrescriptionOrder(id);
      loadData();
      showToast('Prescription order cancelled.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Toast Notice */}
      {toastMessage && (
        <div className={styles.toastNotice}>
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIconBox}>
            💊
          </div>
          <div>
            <div className={styles.categoryPill}>PHARMACY &bull; MEDICAL PRESCRIPTION ORDERS</div>
            <h1 className={styles.title}>Order Medicines with Doctor's List</h1>
            <p className={styles.subtitle}>
              Upload doctor's prescription note or handwritten medicine list. Verified local chemist will bill genuine medicines and dispatch in 15 mins.
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="emerald"
            size="lg"
            onClick={() => setIsModalOpen(true)}
          >
            <UploadCloud size={18} /> Upload Doctor's List Image
          </Button>
        </div>
      </div>

      {/* Quick Feature Highlights Strip */}
      <div className={styles.highlightsGrid}>
        <div className={styles.highlightCard}>
          <div className={styles.highlightIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
            <Clock size={20} />
          </div>
          <div>
            <strong className={styles.highlightTitle}>15-Min Doorstep Delivery</strong>
            <p className={styles.highlightDesc}>Directly dispatched by nearest licensed pharmacy in Baner</p>
          </div>
        </div>

        <div className={styles.highlightCard}>
          <div className={styles.highlightIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <strong className={styles.highlightTitle}>Licensed Pharmacist Review</strong>
            <p className={styles.highlightDesc}>Every doctor's slip is verified under Drugs &amp; Cosmetics Rules</p>
          </div>
        </div>

        <div className={styles.highlightCard}>
          <div className={styles.highlightIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
            <Phone size={20} />
          </div>
          <div>
            <strong className={styles.highlightTitle}>Pharmacist Call Confirmation</strong>
            <p className={styles.highlightDesc}>Chemist calls you to verify dosage, brand &amp; bill amount</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Orders List / Right Live Tracker */}
      <div className={styles.mainGrid}>
        {/* Left Column: Submitted Prescriptions */}
        <div className={styles.ordersColumn}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>My Uploaded Prescriptions ({orders.length})</h3>
            <button
              type="button"
              className={styles.refreshBtn}
              onClick={loadData}
              title="Refresh status"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className={styles.emptyCard}>
              <p>No uploaded doctor's lists yet.</p>
              <Button
                variant="emerald"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                style={{ marginTop: '10px' }}
              >
                Upload First Prescription
              </Button>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                const isDelivered = ord.status === 'delivered';

                return (
                  <div
                    key={ord.id}
                    className={`${styles.orderCard} ${isSelected ? styles.orderCardActive : ''}`}
                    onClick={() => setSelectedOrder(ord)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.orderCardTop}>
                      <div className={styles.orderIdBadge}>
                        <FileText size={13} />
                        <span>{ord.id}</span>
                      </div>
                      <Badge variant={isDelivered ? 'success' : 'primary'} size="xs">
                        {ord.statusLabel}
                      </Badge>
                    </div>

                    <div className={styles.orderCardMiddle}>
                      <img
                        src={ord.imageUrl}
                        alt="Prescription Thumbnail"
                        className={styles.orderThumb}
                      />
                      <div className={styles.orderCardMeta}>
                        <strong className={styles.doctorNameText}>{ord.doctorName}</strong>
                        <span className={styles.clinicText}>{ord.clinicName}</span>
                        <div className={styles.storeNameRow}>
                          <Store size={12} />
                          <span>{ord.storeName}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.orderCardBottom}>
                      <span className={styles.orderDateText}>{formatDate(ord.createdAt)}</span>
                      <span className={styles.orderDaysPill}>{ord.durationDays}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick upload card below orders */}
          <div className={styles.quickUploadBanner}>
            <h4>Have another doctor's slip?</h4>
            <p>Upload handwritten or printed list to get medicines from your nearby chemist.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={14} /> Upload Another List
            </Button>
          </div>
        </div>

        {/* Right Column: Detailed Live Status & Pharmacist Verification */}
        <div className={styles.trackerColumn}>
          {selectedOrder ? (
            <div className={styles.trackerCard}>
              {/* Tracker Header */}
              <div className={styles.trackerHeader}>
                <div>
                  <span className={styles.rxIdHeader}>PRESCRIPTION TRACKER #{selectedOrder.id}</span>
                  <h2 className={styles.trackerTitle}>{selectedOrder.storeName}</h2>
                  <p className={styles.trackerSub}>
                    Patient: <strong>{selectedOrder.patientName}</strong> &bull; Contact: {selectedOrder.contactNumber}
                  </p>
                </div>

                <div className={styles.trackerActions}>
                  <button
                    type="button"
                    className={styles.viewImgBtn}
                    onClick={() => setPreviewModalImg(selectedOrder.imageUrl)}
                    title="View uploaded doctor's prescription image"
                  >
                    <Eye size={14} /> View Uploaded Rx
                  </button>
                  {selectedOrder.status !== 'delivered' && (
                    <button
                      type="button"
                      className={styles.cancelRxBtn}
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      title="Cancel request"
                    >
                      <Trash2 size={14} /> Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Milestones */}
              <div className={styles.milestonesCard}>
                <div className={styles.milestonesTrack}>
                  <div className={`${styles.milestoneItem} ${styles.milestoneDone}`}>
                    <div className={styles.milestoneDot}>✓</div>
                    <div className={styles.milestoneText}>
                      <strong>Doctor List Uploaded</strong>
                      <span>Transmitted directly to medical shop</span>
                    </div>
                  </div>

                  <div
                    className={`${styles.milestoneItem} ${
                      selectedOrder.status !== 'uploaded' ? styles.milestoneDone : styles.milestoneActive
                    }`}
                  >
                    <div className={styles.milestoneDot}>
                      {selectedOrder.status !== 'uploaded' ? '✓' : '2'}
                    </div>
                    <div className={styles.milestoneText}>
                      <strong>Pharmacist Reviewing Prescription</strong>
                      <span>Checking doctor validity, dosage &amp; medicine batch</span>
                    </div>
                  </div>

                  <div
                    className={`${styles.milestoneItem} ${
                      selectedOrder.status === 'billed_ready' || selectedOrder.status === 'out_for_delivery' || selectedOrder.status === 'delivered'
                        ? styles.milestoneDone
                        : ''
                    }`}
                  >
                    <div className={styles.milestoneDot}>
                      {selectedOrder.status === 'delivered' ? '✓' : '3'}
                    </div>
                    <div className={styles.milestoneText}>
                      <strong>Billed with Batch &amp; Expiry</strong>
                      <span>Packaged by chemist with verified tax bill</span>
                    </div>
                  </div>

                  <div
                    className={`${styles.milestoneItem} ${
                      selectedOrder.status === 'delivered' ? styles.milestoneDone : styles.milestonePending
                    }`}
                  >
                    <div className={styles.milestoneDot}>
                      {selectedOrder.status === 'delivered' ? '✓' : '4'}
                    </div>
                    <div className={styles.milestoneText}>
                      <strong>{selectedOrder.status === 'delivered' ? 'Delivered at Doorstep' : '15-Min Delivery Partner'}</strong>
                      <span>Rider dispatched to {selectedOrder.deliveryAddress.split(',')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pharmacist Review Feedback Box */}
              <div className={styles.pharmacistNoteBox}>
                <div className={styles.pharmacistHeader}>
                  <ShieldCheck size={18} color="var(--color-emerald-600)" />
                  <strong>Licensed Pharmacist Verification Note</strong>
                </div>
                <p className={styles.pharmacistNoteText}>
                  "{selectedOrder.pharmacistNotes}"
                </p>
                <div className={styles.storeContactRow}>
                  <span>Pharmacy Helpline: <strong>{selectedOrder.storePhone}</strong></span>
                  <span className={styles.verifiedStorePill}>✓ Authorized Medical Store</span>
                </div>
              </div>

              {/* Transcribed Medicines List */}
              <div className={styles.medicinesListBox}>
                <h4 className={styles.boxTitle}>
                  Medicines Extracted &amp; Billed from Doctor's List
                </h4>
                <div className={styles.medicinesTable}>
                  {selectedOrder.itemsIdentified?.map((med, idx) => (
                    <div key={idx} className={styles.medicineRow}>
                      <div className={styles.medNameCol}>
                        <span className={styles.medBullet}>💊</span>
                        <div>
                          <strong>{med.name}</strong>
                          <span className={styles.medQty}>{med.qty}</span>
                        </div>
                      </div>
                      <span className={styles.medPrice}>{formatCurrency(med.price)}</span>
                    </div>
                  ))}

                  <div className={styles.tableTotalRow}>
                    <span>Estimated Bill (Pay on Delivery or Online):</span>
                    <span className={styles.totalAmount}>
                      {formatCurrency(selectedOrder.estimatedTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Order Details */}
              <div className={styles.patientSpecsGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Delivery Address</span>
                  <strong className={styles.specVal}>{selectedOrder.deliveryAddress}</strong>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Dosage Duration</span>
                  <strong className={styles.specVal}>{selectedOrder.durationDays}</strong>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Generic Substitution</span>
                  <strong className={styles.specVal}>
                    {selectedOrder.allowGeneric ? 'Allowed by customer' : 'Branded only'}
                  </strong>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Call Before Billing</span>
                  <strong className={styles.specVal}>
                    {selectedOrder.callBeforeBilling ? 'Yes, Pharmacist will call' : 'Direct dispatch'}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetailCard}>
              <p>Select a prescription order from the left to view live pharmacist verification.</p>
            </div>
          )}
        </div>
      </div>

      {/* Verified Pharmacies Row */}
      <div className={styles.verifiedPharmaciesSection}>
        <div className={styles.vpHeader}>
          <h3>Verified Partner Medical Shops in Your Area</h3>
          <p>Deliver prescription medicines within 15 to 20 minutes across Pune</p>
        </div>

        <div className={styles.pharmaciesGrid}>
          {pharmacyStores.map((st) => (
            <div key={st.id} className={styles.pharmacyCard}>
              <div className={styles.pharmacyTop}>
                <div className={styles.pEmoji}>🏥</div>
                <div>
                  <h4 className={styles.pName}>{st.name}</h4>
                  <p className={styles.pAddress}>{st.address}, {st.area}</p>
                </div>
                <span className={styles.pRating}>★ {st.rating.toFixed(1)}</span>
              </div>

              <div className={styles.pharmacyMeta}>
                <span>⚡ {st.deliveryEtaMin} mins delivery</span>
                <span>📞 {st.phone || '+91 98234 56789'}</span>
              </div>

              <div className={styles.pharmacyActions}>
                <Button
                  variant="emerald"
                  size="sm"
                  fullWidth
                  onClick={() => setIsModalOpen(true)}
                >
                  <UploadCloud size={14} /> Send Doctor's Slip
                </Button>
                <Link to={`/customer/store/${st.id}`} className={styles.viewCatalogLink}>
                  Browse OTC Catalog →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Prescription Modal */}
      {isModalOpen && (
        <PrescriptionUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            loadData();
            showToast("Doctor's prescription order transmitted to pharmacist!");
          }}
        />
      )}

      {/* Image Preview Modal */}
      {previewModalImg && (
        <div
          className={styles.imageViewerOverlay}
          onClick={() => setPreviewModalImg(null)}
        >
          <div
            className={styles.imageViewerContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.imageViewerHeader}>
              <h4>Uploaded Doctor's Prescription Image</h4>
              <button
                type="button"
                className={styles.closeViewerBtn}
                onClick={() => setPreviewModalImg(null)}
              >
                ✕
              </button>
            </div>
            <img
              src={previewModalImg}
              alt="Uploaded Doctor Prescription Full"
              className={styles.fullPreviewImg}
            />
          </div>
        </div>
      )}
    </div>
  );
}
