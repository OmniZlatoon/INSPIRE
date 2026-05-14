# Daily Development Report - INSPIRE Project
**Date:** May 14, 2026

## Overview
Today's session focused on significantly improving system resilience, visual UI consistency, and resolving major performance bottlenecks related to database payload limits and frontend data fetching.

---

## 1. Global Offline Resilience System (Frontend)
- **Centralized Network State:** Refactored the fragmented offline handling from individual tabs (`CarrierPath`, `CourseOverlook`, `BooksManagement`) into a unified global state managed at the `MainScreen.tsx` level.
- **Heartbeat Mechanism:** Implemented a robust 5-second interval heartbeat pinging `/favicon.ico` with `cache: 'no-store'`. This accurately captures hardware-level Wi-Fi drops that `navigator.onLine` fails to catch.
- **Instant UI Rendering:** The global layout now instantly unmounts the active tab and renders a professional `OfflineMode` component the moment internet connectivity drops, preventing invalid API calls.

## 2. Dynamic Course Icons Integration (Frontend)
- **Component Utilization:** Successfully integrated the `CourseIcon` component across the `CourseOverlook` and `BooksManagement` tabs.
- **Dynamic Mapping:** Replaced generic icons (like `BookOpen`) with mapped, course-specific visual assets (e.g., Python, React, Algebra logos) based on the `courseName`. 
- **Consistency:** Ensured styling consistency by matching the transparent/glassmorphic backgrounds for the newly inserted icons.

## 3. Storage Architecture Migration to Cloudinary (Backend)
- **Identified Bottleneck:** Discovered that storing massive 10MB base64 file strings directly inside Firestore documents was causing severe lag, bloated document sizes, and potential database crashes.
- **Cloudinary Integration:** 
  - Installed and configured the Cloudinary SDK in `backend/auth/Cloudinary/Cloudinary_initialize.js`.
  - Duplicated the root `.env` to the backend directory to securely provide `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- **Refactored Upload Logic:** Modified `books.controller.js` to intercept file buffers from `multer` and stream them directly to Cloudinary using `cloudinary.uploader.upload_stream`.
- **Lightweight Firestore Payloads:** Firestore now only stores the lightweight Cloudinary reference details (`secure_url`, `public_id`, `resource_type`, `name`, `size`).
- **Automated Garbage Collection:** Enhanced the `deleteBook` and `deleteAllBooks` endpoints. Before a book document is deleted from Firestore, the backend explicitly calls `cloudinary.uploader.destroy(public_id)` to permanently remove the physical file from Cloudinary, preventing orphaned assets and saving storage space.

## 4. Frontend Bug Fixes
- **Dashboard Analysis Tab:** Resolved the issue where the "Analysis & Statistics" tab remained stuck in an infinite loading state. This was fixed by re-adding the execution of `fetchStats();` inside the component's `useEffect` hook, forcing the data to fetch upon mounting.

## Notes & Reversions
- *Attempted to optimize `stats.controller.js` by using the Firestore `.count()` aggregation method to prevent downloading entire collections into memory. However, the current version of the `firebase-admin` SDK installed in the project does not support the `.count()` method (`TypeError: db.collection(...).count is not a function`). The changes were successfully reverted to use `.get().size`.*
