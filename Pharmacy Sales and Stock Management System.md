# Pharmacy Sales and Stock Management System (PSSMS)

---

# 💊 Pharmacy Sales and Stock Management System (PSSMS)

**University of Lay Adventists of Kigali (UNILAK)**

**Faculty of Computing and Information Technology**

**Module:** MSIT6120 – Advanced Programming Concepts and Emerging Technologies

**FINAL PROJECT REPORT**

**Project Title:** Pharmacy Sales and Stock Management System (PSSMS)**

**Submitted by:** [Your Name]

**Date:** October 2025

---

## **Abstract**

The **Pharmacy Sales and Stock Management System (PSSMS)** is a web-based inventory and sales management platform designed to assist pharmacies in tracking medicine stocks, managing suppliers, and processing daily sales transactions. The system enables pharmacists to monitor available stock, record purchases and sales, and automatically generate reports for profits, expired items, and reorder levels.

Developed using **Spring Boot (backend)**, **React + Vite + shadcn/ui (frontend)**, and **SQLite (database)**, the system provides a complete, lightweight, and visually appealing solution suitable for educational and small-business use.

---

## **Introduction**

Pharmacy operations involve a continuous process of purchasing, storing, and selling medicines. Manual management often leads to inefficiencies, stockouts, and inaccurate sales tracking.

The **Pharmacy Sales and Stock Management System (PSSMS)** aims to automate these processes by creating a centralized digital platform that handles stock management, supplier records, and point-of-sale transactions efficiently.

The system ensures real-time stock updates, automatic profit computation, and expiry date monitoring, contributing to effective decision-making and better customer service.

---

## **Objectives**

- To automate the process of recording medicine stock, sales, and supplier information.
- To maintain an up-to-date inventory of all medicines in stock.
- To generate sales and profit reports automatically.
- To monitor expiry dates and reorder levels for each item.
- To provide a secure, user-friendly interface for staff and administrators.

---

## **System Description**

PSSMS is built as a **three-tier application** with the following architecture:

1. **Backend (Spring Boot REST API):**
    - Handles CRUD operations for medicines, suppliers, and sales.
    - Uses **Spring Data JPA** for SQLite persistence.
    - Provides secured endpoints using **JWT-based authentication**.
2. **Frontend (React + Vite + shadcn/ui):**
    - Interactive dashboards for stock, sales, and expiry tracking.
    - Uses **Axios** to communicate with the backend API.
    - Built with **Tailwind CSS** and **shadcn/ui** for a modern, responsive interface.
3. **Database (SQLite):**
    - Stores product, supplier, and sales records.
    - Automatically updates quantities after each sale or purchase.

**User Roles:**

- **Admin:** Manage users, suppliers, and reports.
- **Pharmacist:** Manage stock, sales, and inventory updates.
- **Cashier:** Handle sales transactions only.

---

## **System Design**

### **Entity Relationship Diagram (ERD)**

| Entity | Description |
| --- | --- |
| **User** | Application users with login credentials and roles |
| **Supplier** | Source/vendor of medicines |
| **Medicine** | Details about each medicine (name, quantity, expiry, price) |
| **Purchase** | Records of medicines bought from suppliers |
| **Sale** | Tracks sales transactions and total profit per sale |

**Relationships:**

- Supplier → Medicine: **1–N**
- Medicine → Sale: **1–N**
- Medicine → Purchase: **1–N**
- User → Sale: **1–N**

🧩 *ERD created using dbdiagram.io (see Figure 1)*

**dbdiagram.io Code Example:**

```sql
Table User {
  user_id int [pk, increment]
  name varchar
  email varchar [unique]
  password varchar
  role varchar
}

Table Supplier {
  supplier_id int [pk, increment]
  name varchar
  contact varchar
  email varchar
}

Table Medicine {
  medicine_id int [pk, increment]
  name varchar
  category varchar
  cost_price decimal
  selling_price decimal
  quantity int
  expiry_date date
  reorder_level int
  supplier_id int [ref: > Supplier.supplier_id]
}

Table Purchase {
  purchase_id int [pk, increment]
  medicine_id int [ref: > Medicine.medicine_id]
  supplier_id int [ref: > Supplier.supplier_id]
  quantity int
  total_cost decimal
  purchase_date date
}

Table Sale {
  sale_id int [pk, increment]
  medicine_id int [ref: > Medicine.medicine_id]
  user_id int [ref: > User.user_id]
  quantity int
  total_amount decimal
  sale_date date
}

Ref: Supplier.supplier_id < Medicine.supplier_id
Ref: Medicine.medicine_id < Sale.medicine_id
Ref: Medicine.medicine_id < Purchase.medicine_id
Ref: User.user_id < Sale.user_id

```

---

### **System Architecture Diagram**

```
[React + Vite + shadcn/ui Frontend]
       │  (Axios REST Calls)
       ▼
[Spring Boot REST API]
       │  (JPA / Hibernate)
       ▼
[SQLite Database]

```

🧩 *Architecture diagram created with draw.io (see Figure 2).*

---

## **Implementation**

### **Backend (Spring Boot)**

**Project Structure**

```
com.pharmacy
 ├── controller/
 ├── service/
 ├── repository/
 ├── model/
 ├── config/
 └── dto/

```

**API Endpoints:**

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Login & issue JWT |
| GET | `/api/medicines` | List all medicines |
| POST | `/api/medicines` | Add new medicine |
| PUT | `/api/medicines/{id}` | Update existing medicine |
| DELETE | `/api/medicines/{id}` | Delete medicine |
| GET | `/api/sales` | View sales transactions |
| POST | `/api/sales` | Record a sale |
| GET | `/api/reports/stock` | Generate stock report |
| GET | `/api/reports/expiry` | Generate expiry report |

**Key Features:**

- Role-based authentication using **Spring Security + JWT**.
- Automatic update of stock levels after sales.
- Scheduled expiry-date check using `@Scheduled`.
- Data validation using `@NotNull`, `@Email`, and `@Positive`.

---

### **Frontend (React + Vite + shadcn/ui)**

**Pages:**

- `Login.jsx` — Secure login.
- `Dashboard.jsx` — Stock and sales overview with charts.
- `Medicines.jsx` — CRUD interface for medicines.
- `Sales.jsx` — Point-of-sale form and list of recent transactions.
- `Suppliers.jsx` — Manage supplier information.
- `Reports.jsx` — View expiry and stock-level reports.

**Libraries & Tools:**

- **Axios** — Backend API requests.
- **React Router** — Navigation.
- **shadcn/ui** — Components like Card, Table, Button, Input, Dialog.
- **TailwindCSS** — Layout and responsive design.
- **Chart.js** — Visualize sales performance and stock trends.

**UI Design:**

- Clean, dashboard-based layout.
- Sidebar navigation for quick access to key modules.
- Tables for data, forms for CRUD operations.

---

### **Database (SQLite)**

**Configuration (application.properties):**

```
spring.datasource.url=jdbc:sqlite:pharmacy.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.SQLiteDialect

```

**Tables:**

- users
- suppliers
- medicines
- purchases
- sales

All managed automatically by Hibernate through annotated entity models.

---

## **Testing**

**Backend:**

- APIs tested with **Postman** for all CRUD endpoints.
- Verified automatic stock update and expiry detection.

**Frontend:**

- Browser testing for each module.
- JWT-protected pages validated.
- Cross-browser responsiveness verified.

**Integration:**

- Axios communication tested between React and backend.

📸 *Screenshots attached:*

- Postman API calls.
- React dashboard view.
- Sales form and report page.

---

## **Challenges and Solutions**

| Challenge | Solution |
| --- | --- |
| SQLite database locks during concurrent writes | Enabled connection pooling via HikariCP |
| Role-based API restrictions misconfigured | Adjusted Spring Security filter chain |
| Chart data not updating | Implemented React state updates with `useEffect` |
| Expiry alerts not triggering | Added `@Scheduled(fixedRate = 86400000)` for daily checks |

---

## **Conclusion and Recommendations**

The **Pharmacy Sales and Stock Management System** provides a simple yet powerful solution for pharmacy operations. It effectively automates inventory tracking, supplier management, and sales monitoring in a secure, lightweight architecture.

**Future Enhancements:**

- Integration with barcode scanning systems.
- Automatic email alerts for expired medicines.
- PDF export for daily sales reports.

---

## **References**

1. Spring Boot Documentation – [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)
2. React.js Official Documentation – [https://react.dev](https://react.dev/)
3. SQLite Developer Guide – [https://www.sqlite.org/docs.html](https://www.sqlite.org/docs.html)
4. shadcn/ui – [https://ui.shadcn.com](https://ui.shadcn.com/)
5. Chart.js Documentation – [https://www.chartjs.org/docs/](https://www.chartjs.org/docs/)

---

✅ *ERD created using dbdiagram.io and architecture diagram created using draw.io.*

✅ *Project built using Spring Boot + React (Vite + shadcn/ui) + SQLite.*

---

Would you like me to now prepare the **ERD + architecture diagrams (dbdiagram.io code + draw.io layout)** for this Pharmacy system — ready for direct use in your report and build phase?