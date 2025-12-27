# Software Design Document (SDD) - ApartmentOS

**Version:** 1.0.0
**Status:** Approved
**Architecture:** Monorepo / Multi-Service

## 1. Executive Summary & Scope

ApartmentOS is a B2B SaaS (Software as a Service) platform designed for professional property management firms to oversee **multiple apartments or sites** from a single, centralized dashboard.

The system empowers managers to organize financial tracking (dues, expenses), asset management (blocks, units), and resident records securely and efficiently.

## 2. System Actors (Roles)

The application is used exclusively by authorized management personnel.

### 2.1. Platform Admin (Super User)

- Owner of the application (SaaS Provider).
- Onboards "Site Manager" firms into the system.
- Manages the account status (active/passive) of the managers.

### 2.2. Site Manager (Primary User)

- The main customer of the system.
- Can create and manage multiple sites/apartments.
- Responsible for processing financial and administrative records for the sites they manage.
- Maintains resident data (Name, Contact, Entry Date) acting as a CRM.

_Note: Residents do not have access credentials; they exist solely as data entities managed by the Site Manager._

## 3. Tech Stack

- **Backend:** Node.js (NestJS Framework) - Modular and scalable architecture.
- **Frontend:** React (Vite), TypeScript.
- **UI Framework:** Ant Design (AntD) - Enterprise-level dashboard components.
- **State Management:** Zustand - Atomic and performant state management.
- **Database:** PostgreSQL.
- **ORM:** Prisma.

## 4. Functional Features

### 4.1. Multi-Property Management (Multi-Tenancy for Managers)

- Managers can add an unlimited number of "Sites" or "Apartments" to their panel.
- **Context Switching:** Users select the specific site they want to manage, and all data (financials, residents) is filtered instantly based on that selection.

### 4.2. Asset & Resident Management

- **Hierarchy:** Structure defined as Site -> Block -> Unit.
- **Resident Database:** Information regarding "Homeowners" or "Tenants" (Contact info, Move-in dates) is recorded by the manager. This module serves as a digital directory.

### 4.3. Financial Management

- **Income Tracking:** Batch processing of dues (accrual) to units and recording of collections.
- **Expense Tracking:** Categorizing and recording operational expenses (Electricity, Water, Maintenance, Staff).
- **Reporting:** Real-time view of cash flow, pending debts, and monthly expense reports for the selected site.
