# CRM MVP

A modern full-stack CRM system with contact management, deal tracking, and email integration.

## Features

- 📇 **Contact Management**: Store and manage customer information
- 💼 **Deal Tracking**: Track sales opportunities and pipeline
- 📧 **Email Integration**: Communicate with contacts directly from the CRM
- 🔐 **Authentication**: Secure user authentication and authorization
- 📊 **Dashboard**: Visual overview of sales metrics and activities

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB/PostgreSQL (database)
- JWT Authentication
- RESTful API

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

## Project Structure

```
crm-mvp/
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Custom middleware
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   ├── package.json
│   └── server.js        # Entry point
│
├── frontend/            # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB or PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/G9Pedro/crm-mvp.git
cd crm-mvp
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
- Copy `.env.example` to `.env` in both backend and frontend directories
- Update the variables with your configuration

5. Start the development servers:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Contacts
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create new contact
- `GET /api/contacts/:id` - Get contact by ID
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Deals
- `GET /api/deals` - Get all deals
- `POST /api/deals` - Create new deal
- `GET /api/deals/:id` - Get deal by ID
- `PUT /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal

### Emails
- `GET /api/emails` - Get email history
- `POST /api/emails/send` - Send email to contact

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Author

Pedro Sobral
