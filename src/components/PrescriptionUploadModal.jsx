// src/components/PrescriptionUploadModal.jsx — Pharmacy Doctor's Prescription / List Image Upload Modal
import { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  Clock,
  Store,
  ShieldCheck,
  AlertCircle,
  Eye,
  Trash2,
  Phone,
  Sparkles,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import {
  prescriptionService,
  SAMPLE_PRESCRIPTIONS,
} from '../services/prescriptionService.js';
import { mockStores } from '../data/stores.js';
import styles from './PrescriptionUploadModal.module.css';

export default function PrescriptionUploadModal({
  isOpen,
  onClose,
  initialStoreId = 's2',
  onSuccess,
}) {
  const fileInputRef = useRef(null);

  // Pharmacy stores
  const pharmacyStores = mockStores.filter((s) => s.category === 'pharmacy');
  const [selectedStoreId, setSelectedStoreId] = useState(initialStoreId);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(null);
  const [durationDays, setDurationDays] = useState('Full Prescription');
  const [allowGeneric, setAllowGeneric] = useState(true);
  const [callBeforeBilling, setCallBeforeBilling] = useState(true);
  const [patientNotes, setPatientNotes] = useState('');
  const [patientName, setPatientName] = useState('Priya Sharma');
  const [contactNumber, setContactNumber] = useState('+91 98765 43210');
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Handle local file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setSelectedSampleIndex(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle selecting a sample doctor's prescription for quick testing
  const handleSelectSample = (sample, idx) => {
    setSelectedSampleIndex(idx);
    setUploadedImage(null);
    setImagePreviewUrl(sample.previewUrl);
    setPatientNotes(`Requested: ${sample.title}`);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
    setImagePreviewUrl('');
    setSelectedSampleIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!imagePreviewUrl) {
      alert("Please upload a doctor's list photo or select one of the sample prescription presets.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const selectedStore = pharmacyStores.find((s) => s.id === selectedStoreId) || pharmacyStores[0];
      const newOrder = prescriptionService.createPrescriptionOrder({
        imageUrl: imagePreviewUrl,
        doctorName: selectedSampleIndex !== null ? SAMPLE_PRESCRIPTIONS[selectedSampleIndex].doctorName : "Doctor's Prescription Note",
        clinicName: selectedSampleIndex !== null ? SAMPLE_PRESCRIPTIONS[selectedSampleIndex].clinic : 'Local Clinic, Pune',
        patientName,
        storeId: selectedStore.id,
        durationDays,
        allowGeneric,
        callBeforeBilling,
        patientNotes,
        contactNumber,
      });

      setSubmitting(false);
      setCompletedOrder(newOrder);
      if (onSuccess) onSuccess(newOrder);
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setCompletedOrder(null);
        onClose();
      }}
      title={completedOrder ? 'Prescription Order Sent!' : "Upload Doctor's Medicine List / Prescription"}
      size="md"
    >
      {completedOrder ? (
        <div className={styles.completedWrap}>
          <div className={styles.completedIcon}>
            <CheckCircle size={44} />
          </div>
          <h3 className={styles.completedTitle}>Transmitted to {completedOrder.storeName}!</h3>
          <p className={styles.completedDesc}>
            Your prescription order <strong>#{completedOrder.id}</strong> has been received by the registered pharmacist.
          </p>

          <div className={styles.processStepsBox}>
            <div className={styles.stepRow}>
              <div className={styles.stepNumDone}>✓</div>
              <div className={styles.stepText}>
                <strong>Prescription Uploaded</strong>
                <span>Image transmitted securely to medical store</span>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumActive}>2</div>
              <div className={styles.stepText}>
                <strong>Pharmacist Review in Progress</strong>
                <span>Registered Pharmacist is verifying dosage &amp; medicine stock</span>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumFuture}>3</div>
              <div className={styles.stepText}>
                <strong>Direct Call &amp; Dispatch in 15 Mins</strong>
                <span>
                  {callBeforeBilling ? 'Pharmacist will call your phone before dispatch' : 'Will be dispatched automatically'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.completedActions}>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setCompletedOrder(null);
                onClose();
              }}
            >
              Done & Track Order
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.modalBody}>
          {/* Info Banner */}
          <div className={styles.infoBanner}>
            <Sparkles size={16} />
            <span>
              Upload doctor's prescription list image &bull; Local chemist will pack genuine medicines and deliver in 15 mins!
            </span>
          </div>

          {/* Upload Zone */}
          <div className={styles.uploadSection}>
            <label className={styles.fieldLabel}>
              1. Doctor's Prescription / Medicine List Photo
            </label>

            {imagePreviewUrl ? (
              <div className={styles.previewContainer}>
                <img
                  src={imagePreviewUrl}
                  alt="Doctor Prescription Preview"
                  className={styles.previewImage}
                />
                <div className={styles.previewOverlay}>
                  <span className={styles.previewTag}>✓ Image Ready</span>
                  <button
                    type="button"
                    className={styles.clearImageBtn}
                    onClick={handleClearImage}
                    title="Remove and re-upload"
                  >
                    <Trash2 size={14} /> Remove / Replace
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={styles.dropzone}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                />
                <div className={styles.dropzoneIconWrap}>
                  <UploadCloud size={28} />
                </div>
                <h4 className={styles.dropzoneTitle}>
                  Click to Browse or Drag &amp; Drop Photo
                </h4>
                <p className={styles.dropzoneSub}>
                  Upload doctor's handwritten slip or printed prescription (JPG, PNG, PDF up to 10MB)
                </p>
              </div>
            )}

            {/* Quick Sample Prescriptions Preset (Useful for immediate test) */}
            <div className={styles.samplePresetsRow}>
              <span className={styles.sampleLabel}>Or test with sample Rx:</span>
              <div className={styles.sampleButtons}>
                {SAMPLE_PRESCRIPTIONS.map((sample, idx) => (
                  <button
                    key={sample.id}
                    type="button"
                    className={`${styles.sampleBtn} ${selectedSampleIndex === idx ? styles.sampleBtnActive : ''}`}
                    onClick={() => handleSelectSample(sample, idx)}
                  >
                    📄 {idx === 0 ? 'Fever & Antibiotics Rx' : 'Daily BP & Diabetes Rx'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Select Medical Store */}
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>2. Select Verified Medical Shop</label>
            <div className={styles.storeSelectGrid}>
              {pharmacyStores.map((st) => (
                <div
                  key={st.id}
                  className={`${styles.pharmacyStoreCard} ${selectedStoreId === st.id ? styles.pharmacyStoreCardActive : ''}`}
                  onClick={() => setSelectedStoreId(st.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.storeCardLeft}>
                    <div className={styles.storeEmoji}>💊</div>
                    <div>
                      <h4 className={styles.storeName}>{st.name}</h4>
                      <p className={styles.storeArea}>
                        {st.area} &bull; {st.distanceKm} km away &bull; {st.deliveryEtaMin} min delivery
                      </p>
                    </div>
                  </div>
                  <div className={styles.storeRating}>
                    ★ {st.rating.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dosage Duration & Preferences */}
          <div className={styles.formRow}>
            <div className={styles.formGroupHalf}>
              <label className={styles.fieldLabel}>Dosage Supply Duration</label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className={styles.selectInput}
              >
                <option value="Full Prescription">Full Prescription (As written by Doctor)</option>
                <option value="5 Days Supply">5 Days Course</option>
                <option value="10 Days Supply">10 Days Course</option>
                <option value="15 Days Supply">15 Days Course</option>
                <option value="30 Days Supply">30 Days (Full Monthly Maintenance)</option>
              </select>
            </div>

            <div className={styles.formGroupHalf}>
              <label className={styles.fieldLabel}>Patient Contact Number</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className={styles.textInput}
                placeholder="+91 Mobile number"
              />
            </div>
          </div>

          {/* Notes to Pharmacist */}
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>Instructions for the Chemist / Pharmacist</label>
            <input
              type="text"
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="e.g. Call before dispatch, only send branded medicines, etc."
              className={styles.textInput}
            />
          </div>

          {/* Checkboxes */}
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={callBeforeBilling}
                onChange={(e) => setCallBeforeBilling(e.target.checked)}
              />
              <span>Pharmacist must call me before billing to confirm medicines &amp; price</span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={allowGeneric}
                onChange={(e) => setAllowGeneric(e.target.checked)}
              />
              <span>Allow verified generic equivalent if prescribed brand is unavailable</span>
            </label>
          </div>

          {/* Security & Doctor Compliance Badge */}
          <div className={styles.complianceNote}>
            <ShieldCheck size={16} />
            <span>
              Orders verified by Licensed Pharmacist under Drug &amp; Cosmetics Act. Original tax invoice with batch numbers included.
            </span>
          </div>

          {/* Footer Submit */}
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="emerald"
              loading={submitting}
              onClick={handleSubmit}
              disabled={!imagePreviewUrl}
            >
              <UploadCloud size={16} /> Transmit to Chemist &amp; Order
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
