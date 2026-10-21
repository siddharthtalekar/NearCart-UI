# NearCart — Hyperlocal Marketplace Frontend

A complete, responsive, full-featured React frontend for **NearCart**, a hyperlocal marketplace platform connecting neighborhood stores, shoppers, and local couriers in Pune, India.

---

## 🌟 Key Features & Business Rules Enforced

1. **Hyperlocal Delivery Scoping**: Customer discovery and product listings are strictly scoped to the confirmed delivery area (Baner / Aundh / Hinjewadi clusters in Pune).
2. **Exact-Match Price Comparison**: Real-time price, stock, and delivery fee comparison of identical products across local stores. Different sizes, brands, or volume variants are **never** merged as identical; similar options are presented in an isolated section with clear notice labels.
3. **Validated Stepper Checkout**: Re-validates inventory stock, updated prices, active discounts, and calculated totals before placing orders. Features duplicate-order prevention with loading states and idempotency keys.
4. **Interactive Order Tracking**: Live status timelines (`Placed` ➔ `Accepted` ➔ `Preparing` ➔ `Picked up` ➔ `In transit` ➔ `Delivered`), delivery partner info card, simulated moving pin on a map canvas, and 4-digit doorstep verification OTP.
5. **Shop Owner Hub**: Store registration wizard with map location pin and document uploads (`Pending Admin Approval` state), real-time incoming orders board (Kanban stages with Accept/Reject modal), inventory catalog management with bulk stock editing, promo offers creator, and Recharts analytics.
6. **Delivery Courier Portal**: Online/offline toggle, earnings dashboard, incoming assignment request screen with a 30-second countdown timer, active navigation steps (`Arrived at Store`, `Picked Up`, `In Transit`, `Delivered`), masked customer phone bridge, COD collection confirmation, and OTP verification.
7. **Platform Administration**: High-level GMV & order trend analytics, store & courier KYC approval queues, user suspension / reactivation, category taxonomy manager, live orders monitor, and fraud anomaly detection logs.
8. **Modern Aesthetic & Design System**: Hand-crafted CSS tokens with 8px grid, smooth transitions, glassmorphism, responsive navigation (bottom tab bar for mobile, sidebar for desktop), and dark/light mode toggle. See the complete [DESIGN.md](DESIGN.md) guide.

---

## 📁 Folder Structure

```text
src/
├── assets/                  # Logos and static icons
├── components/              # Reusable UI Primitives
│   ├── Badge.jsx            # Status badges
│   ├── Button.jsx           # Button variants (primary, outline, ghost, danger)
│   ├── Card.jsx             # Card, CardHeader, CardBody, CardFooter
│   ├── EmptyState.jsx       # Empty data feedback
│   ├── Input.jsx            # Form input, textarea, and select
│   ├── MapView.jsx          # Hyperlocal map canvas with pins
│   ├── Modal.jsx            # Accessible dialog with focus trap
│   ├── NotificationBell.jsx # Header notification dropdown
│   ├── PaymentGatewayMock.jsx # Mock payment modal (UPI, Card, NetBanking)
│   ├── ProtectedRoute.jsx   # Role-based route authorization guard
│   ├── QuantityStepper.jsx  # +/- Stepper with min/max stock limits
│   ├── Rating.jsx           # Star rating display
│   ├── Skeleton.jsx         # Loading shimmer placeholders
│   ├── Table.jsx            # Responsive data tables
│   ├── Tabs.jsx             # Accessible tab buttons
│   └── Toast.jsx            # Toast alert system
├── context/                 # State Management
│   ├── AuthContext.jsx      # Authentication & demo role switching
│   ├── CartContext.jsx      # Multi-store cart, quantity, coupons
│   ├── NotificationContext.jsx # Real-time notification alerts
│   └── OrderContext.jsx     # Order placement and status history
├── data/                    # Mock Dataset (Pune Context)
│   ├── offers.js            # Promo codes & discount structures
│   ├── orders.js            # Multi-stage orders & dispute tickets
│   ├── products.js          # 60+ localized products with variants
│   ├── stores.js            # Verified neighborhood shops
│   └── users.js             # Sample accounts across all 4 roles
├── hooks/
│   ├── useFetch.js          # Generic async fetcher
│   └── useTheme.js          # Dark/Light theme with localStorage sync
├── layouts/
│   ├── AdminLayout.jsx      # Admin sidebar shell
│   ├── CustomerLayout.jsx   # Customer shell with sticky header & mobile tab bar
│   ├── DashboardLayout.jsx  # Shared sidebar layout for dashboards
│   ├── DeliveryLayout.jsx   # Delivery courier sidebar shell
│   ├── OwnerLayout.jsx      # Shop owner sidebar shell
│   └── PublicLayout.jsx     # Public landing & auth shell
├── pages/
│   ├── admin/               # Admin Portal (Dashboard, Approvals, Users, Categories, Orders, Disputes, Fraud, Settings)
│   ├── auth/                # Landing, Login, Register, Forgot Password, Notifications, 404, 403
│   ├── customer/            # LocationGate, Home, Store, Search, ProductDetail, Cart, Checkout, Tracking, Orders, Profile
│   ├── delivery/            # Dashboard, ActiveDelivery, Request, History, Registration
│   └── owner/               # Dashboard, Products, Orders Board, Offers, Settings, Registration, Reviews & Earnings
├── services/                # Mock Service Layer (Async with simulated delay)
│   ├── authService.js
│   ├── notificationService.js
│   ├── orderService.js
│   └── storeService.js
├── styles/
│   └── variables.css        # Design tokens: palette, typography, radii, shadows
├── utils/
│   └── helpers.js           # Currency formatting (INR), date formatting, delay, ID generator
├── App.jsx                  # Complete route configuration
├── index.css                # Base reset and typography
└── main.jsx                 # Application entry point
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🔑 Demo Credentials

NearCart includes **1-Click Instant Demo Login** on the landing page and login screen. You can also sign in manually with any of these sample accounts:

| Role | Email | Password | Initial Redirect |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@nearcart.in` | `password123` | `/customer` |
| **Shop Owner** | `owner@nearcart.in` | `password123` | `/owner` |
| **Delivery Courier** | `delivery@nearcart.in` | `password123` | `/delivery` |
| **Platform Admin** | `admin@nearcart.in` | `password123` | `/admin` |

---

## 🗺️ Route Directory

### Public & Auth Routes
- `/`: Landing page with local search, role CTAs, 6-step how-it-works, and instant demo login.
- `/login`: Sign in with email/password validation and role quick-fill buttons.
- `/register`: Multi-role onboarding selector (`Customer`, `Shop Owner`, `Courier`).
- `/forgot-password`: Mock password reset link dispatcher.
- `/notifications`: Full notifications center with read/unread filtering.
- `/unauthorized`: 403 Access restricted guard.

### Customer Routes
- `/customer`: Nearby stores discover feed with category chips, distance filters, and list/grid toggle.
- `/customer/location`: Delivery address gate and geolocation selector.
- `/customer/store/:storeId`: Store banner, category tabs, and product catalog.
- `/customer/search`: Multi-filter search (price range, brand, stock, category, sorting).
- `/customer/product/:productId`: Product details with **strict exact-match price comparison table** across local stores, plus separated "Similar but different" options.
- `/customer/cart`: Items grouped by store, quantity steppers, promo code entry, itemized fees upfront.
- `/customer/checkout`: Validated stepper (Address ➔ Slot ➔ Payment ➔ Review & Validation).
- `/customer/orders`: Order history with tax invoice generator, reorder button, and dispute ticket submission.
- `/customer/orders/:orderId`: Live order tracking timeline with simulated courier GPS map and OTP code.
- `/customer/profile`: Contact details, saved addresses, and notification toggles.

### Shop Owner Routes
- `/owner`: Dashboard KPIs, gross sales chart (Recharts), low stock alerts.
- `/owner/orders`: Incoming orders board with Accept/Reject modal and preparation stage updates.
- `/owner/products`: Product catalog table with Add/Edit modal and bulk stock updating.
- `/owner/offers`: Promotional coupons and discount creator.
- `/owner/store`: Store profile, hours, delivery radius, and Holiday mode toggle.
- `/owner/reviews`: Customer reviews and weekly bank payout settlements.
- `/owner/register`: Merchant onboarding wizard with map pin and document uploads.

### Delivery Partner Routes
- `/delivery`: Dashboard with online/offline toggle, today's earnings, and active trip alert.
- `/delivery/request`: Incoming assignment request screen with 30-second countdown timer.
- `/delivery/active`: Live navigation steps, masked customer calling, COD collection, and OTP confirmation.
- `/delivery/history`: Past completed deliveries and earnings summary.
- `/delivery/register`: Courier registration and KYC verification status.

### Admin Routes
- `/admin`: Platform KPIs, monthly GMV area chart, recent events feed.
- `/admin/approvals`: Verification queue for store and courier documents with approve/reject reasons.
- `/admin/users`: User directory with role filters and account suspend/reactivate toggles.
- `/admin/categories`: Taxonomy manager with emoji icons and reordering.
- `/admin/orders`: Live platform orders monitor with inspection drawer.
- `/admin/disputes`: Dispute arbitration thread with refund and legal escalation actions.
- `/admin/fraud`: Security anomaly detection logs (velocity alerts, promo abuse, GPS spoofing).
- `/admin/settings`: Platform fee schedules, delivery radius defaults, and payment method switches.

---

## 🔌 Backend Integration Points (Firebase / Core Java API Mapping)

All mock functions in `/src/services/` are structured asynchronously so that real API clients (e.g. Firebase SDK or a Java Spring Boot REST backend) can be swapped in without modifying UI components.

| Service Function | Target Future API | Expected Payload / Notes |
| :--- | :--- | :--- |
| `authService.login` | `POST /api/v1/auth/login` or Firebase `signInWithEmailAndPassword` | Returns JWT / Session token + user object |
| `authService.register` | `POST /api/v1/auth/register` or Firebase `createUserWithEmailAndPassword` | Creates user profile doc in Firestore `users/{userId}` |
| `authService.updateProfile` | `PATCH /api/v1/users/{id}` or Firestore `updateDoc` | Profile updates |
| `storeService.getNearbyStores` | `GET /api/v1/stores/nearby?lat=&lng=&radius=` or GeoFirestore | Geohash query for stores within delivery radius |
| `storeService.searchProducts` | `GET /api/v1/products/search` or Algolia / Elasticsearch | Multi-field search across localized inventory |
| `storeService.getPriceComparison` | `GET /api/v1/products/{id}/compare` | Queries matching barcode/UPC across nearby stores |
| `storeService.addProduct` | `POST /api/v1/stores/{storeId}/products` | Uploads image to Cloud Storage & writes inventory |
| `orderService.placeOrder` | `POST /api/v1/orders` (Spring Boot transactional handler) | Accepts `Idempotency-Key` header, deducts stock, creates order |
| `orderService.respondToOrder` | `POST /api/v1/orders/{id}/respond` | Triggers FCM push notification to customer |
| `orderService.updateDeliveryStep` | `PATCH /api/v1/orders/{id}/delivery-step` | Verifies OTP code and broadcasts WebSocket location update |
| `notificationService.getNotifications` | Firebase Cloud Messaging (FCM) + Firestore snapshot listener | Real-time push stream of order-stage changes |

---

## 🎨 Design System Tokens

- **Brand Primary**: Emerald `#10b981` (Warm, trustworthy local commerce)
- **Accent**: Orange `#f97316` (Promotions and urgency)
- **Surfaces**: Light `#ffffff` / Dark `#1e293b`
- **Backgrounds**: Light `#f9fafb` / Dark `#0f172a`
- **Typography**: Inter (Google Fonts system fallback)
- **Grid**: Strict 8px spacing system (`--space-1` = 4px, `--space-2` = 8px, `--space-4` = 16px, `--space-6` = 24px)
