# 🚘 Vehicle Diagnostics Dashboard Backend

## 📘 Overview

This backend exposes a diagnostics query API on top of PostgreSQL and handles startup-time data bootstrap from a log file.

It demonstrates practical backend engineering patterns: validation-first request handling, layered architecture, SQL query composition, and secure middleware-driven controls.

## 🛠️ Core Responsibilities

- initialize database schema during startup
- import diagnostic logs when storage is empty
- validate query parameters before execution
- return filtered, sorted, paginated records
- compute aggregate stats for dashboard KPI rendering

## 🧰 Tech Stack

- Node.js (ES modules)
- Express
- PostgreSQL (pg)
- Joi
- Jest

## ✨ Feature Highlights

- route/controller/service/repository separation
- defensive query validation with Joi
- centralized error middleware
- optional bearer-token auth via API_TOKEN
- aggregate stats plus record payload in one response

## 🏗️ Architecture

Startup layer
- app.js initializes middleware, schema, import flow, and listener

Transport layer
- routes map endpoints to controllers

Application layer
- controller validates input and maps request to service filters

Domain/service layer
- service contains parsing and orchestration logic

Data layer
- repository executes parameterized SQL for records and stats

Cross-cutting middleware
- auth middleware for optional token enforcement
- error middleware for normalized failure responses

## 📡 API Contract

Endpoint
- GET /logs

Query parameters
- vehicleId or vehicleid
- errorCode
- severity
- fromDate (ISO)
- toDate (ISO)
- limit (default 10)
- offset (default 0)
- sortBy: dateTimeCreated | vehicleId | logType | code
- sortOrder: asc | desc

Sample request
- /logs?vehicleId=1234&severity=ERROR&limit=10&offset=0&sortBy=dateTimeCreated&sortOrder=desc

Response shape
- sortedBy
- sortedOrder
- limit
- offset
- records
- stats

Stats object fields
- total
- errors
- warns
- infos
- vehicles
- codes

## 🚀 Getting Started

Prerequisites
- Node.js 20+
- npm
- PostgreSQL

Environment variables
- Required: DATABASE_URL, CLIENT_URL
- Optional: PORT, NODE_ENV, API_TOKEN

Install and run (dev)
1. npm install
2. set environment variables
3. npm run dev

Run (production mode)
- npm start

Default local URL
- http://localhost:3000

## ✅ Testing

- npm test

## 🐳 Docker

A Dockerfile is included and exposes port 3000.

## 🧪 Recommended Test Expansion

- Joi schema boundary cases
- parser behavior for malformed log lines
- controller error-path assertions for invalid inputs
- service bootstrap behavior when data exists vs empty state
- repository tests with mocked db responses
- middleware tests for auth pass/fail and error propagation

## 📝 Operational Notes

- If API_TOKEN is configured, clients must send Authorization: Bearer <token>.
- Query sort fields are constrained by validation, reducing injection risk.
