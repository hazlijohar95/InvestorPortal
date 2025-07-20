# API Documentation

## Authentication

All API endpoints require authentication except for the login endpoint.

### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "admin"
  }
}
```

### Logout
```http
POST /api/logout
```

### Get Current User
```http
GET /api/auth/user
```

## Business Metrics

### Get Metrics
```http
GET /api/metrics
```

**Response:**
```json
{
  "id": 1,
  "revenue": 125000,
  "users": 1250,
  "growth": 15.5,
  "burn": 25000,
  "runway": 18,
  "lastUpdated": "2025-01-15T10:30:00Z"
}
```

### Update Metrics
```http
PUT /api/metrics
Content-Type: application/json

{
  "revenue": 130000,
  "users": 1300,
  "growth": 16.2,
  "burn": 24000,
  "runway": 19
}
```

## Company Updates

### Get All Updates
```http
GET /api/updates
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Q4 Results",
    "content": "Great quarter with 20% growth...",
    "author": "CEO",
    "category": "financial",
    "priority": "high",
    "createdAt": "2025-01-15T10:30:00Z"
  }
]
```

### Create Update
```http
POST /api/updates
Content-Type: application/json

{
  "title": "Product Launch",
  "content": "We're excited to announce...",
  "author": "Product Team",
  "category": "product",
  "priority": "high"
}
```

### Update an Update
```http
PUT /api/updates/:id
Content-Type: application/json

{
  "title": "Updated Product Launch",
  "content": "Updated announcement...",
  "priority": "medium"
}
```

### Delete Update
```http
DELETE /api/updates/:id
```

## Cap Table / Stakeholders

### Get All Stakeholders
```http
GET /api/stakeholders
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Investor",
    "email": "john@vc.com",
    "type": "investor",
    "shares": 100000,
    "percentage": 10.5,
    "investmentAmount": 500000,
    "joinedAt": "2024-01-15T00:00:00Z"
  }
]
```

### Create Stakeholder
```http
POST /api/stakeholders
Content-Type: application/json

{
  "name": "Jane Investor",
  "email": "jane@vc.com",
  "type": "investor",
  "shares": 50000,
  "percentage": 5.2,
  "investmentAmount": 250000
}
```

### Update Stakeholder
```http
PUT /api/stakeholders/:id
Content-Type: application/json

{
  "shares": 55000,
  "percentage": 5.7
}
```

## Milestones / Timeline

### Get All Milestones
```http
GET /api/milestones
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Product MVP",
    "description": "Launch minimum viable product",
    "targetDate": "2025-03-01T00:00:00Z",
    "status": "in-progress",
    "category": "product",
    "priority": "high"
  }
]
```

### Create Milestone
```http
POST /api/milestones
Content-Type: application/json

{
  "title": "Series A Funding",
  "description": "Raise $5M Series A round",
  "targetDate": "2025-06-01T00:00:00Z",
  "status": "planned",
  "category": "funding",
  "priority": "high"
}
```

### Update Milestone
```http
PUT /api/milestones/:id
Content-Type: application/json

{
  "status": "completed",
  "completedDate": "2025-02-28T00:00:00Z"
}
```

### Delete Milestone
```http
DELETE /api/milestones/:id
```

## Documents

### Get All Documents
```http
GET /api/documents
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Investor Deck Q4 2024",
    "url": "https://drive.google.com/file/d/...",
    "type": "presentation",
    "category": "investor-relations",
    "uploadedBy": "admin-001",
    "createdAt": "2025-01-15T10:30:00Z"
  }
]
```

### Create Document
```http
POST /api/documents
Content-Type: application/json

{
  "title": "Financial Statements",
  "url": "https://drive.google.com/file/d/...",
  "type": "spreadsheet",
  "category": "financial"
}
```

### Delete Document
```http
DELETE /api/documents/:id
```

## Ask Board

### Get All Asks
```http
GET /api/asks
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Introduction to Enterprise Clients",
    "description": "Looking for warm introductions to F500 companies",
    "category": "networking",
    "urgency": "medium",
    "status": "open",
    "views": 15,
    "createdBy": "admin-001",
    "createdAt": "2025-01-15T10:30:00Z"
  }
]
```

### Create Ask
```http
POST /api/asks
Content-Type: application/json

{
  "title": "Technical Advisory",
  "description": "Need guidance on scaling infrastructure",
  "category": "technical",
  "urgency": "high"
}
```

### Update Ask
```http
PUT /api/asks/:id
Content-Type: application/json

{
  "status": "resolved",
  "urgency": "low"
}
```

### Delete Ask
```http
DELETE /api/asks/:id
```

### Increment Ask Views
```http
POST /api/asks/:id/view
```

## Ask Responses

### Get Responses for Ask
```http
GET /api/asks/:askId/responses
```

**Response:**
```json
[
  {
    "id": 1,
    "askId": 1,
    "content": "I can help with enterprise introductions...",
    "author": "John Investor",
    "helpful": true,
    "createdAt": "2025-01-15T11:00:00Z"
  }
]
```

### Create Response
```http
POST /api/asks/:askId/responses
Content-Type: application/json

{
  "content": "Happy to help with this request...",
  "author": "Jane Investor",
  "helpful": true
}
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "message": "Validation error: Invalid email format"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "message": "Too many requests"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **General API endpoints**: 100 requests per 15 minutes per IP
- **File upload endpoints**: 10 requests per hour per user

## Data Types

### User Types
- `admin`: Full access to create, edit, and delete all data
- `investor`: Read-only access to all data, can respond to asks

### Categories
- **Updates**: `financial`, `product`, `team`, `milestone`, `general`
- **Documents**: `financial`, `legal`, `investor-relations`, `product`, `general`
- **Asks**: `networking`, `technical`, `business`, `funding`, `general`
- **Milestones**: `product`, `funding`, `team`, `business`, `general`

### Statuses
- **Milestones**: `planned`, `in-progress`, `completed`, `delayed`
- **Asks**: `open`, `in-progress`, `resolved`, `closed`

### Urgency Levels
- `low`, `medium`, `high`, `critical`

## Security

- All endpoints use HTTPS in production
- Session-based authentication with secure cookies
- CSRF protection enabled
- Rate limiting implemented
- Input validation and sanitization
- SQL injection prevention