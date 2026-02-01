# CRM MVP Frontend

Modern React frontend for the CRM MVP application.

## Features

- 🔐 **Authentication**: Login and registration with JWT
- 📊 **Dashboard**: Overview of contacts, deals, and revenue
- 👥 **Contact Management**: Full CRUD operations with search
- 💼 **Deal Pipeline**: Drag-and-drop kanban board for deal management
- 📧 **Email Center**: Send and track emails to contacts
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Built with Tailwind CSS

## Tech Stack

- **React 18**: Latest React with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Icon library
- **React Toastify**: Toast notifications
- **date-fns**: Date formatting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── ContactForm.jsx
│   │   ├── DealForm.jsx
│   │   ├── DealPipeline.jsx
│   │   ├── EmailModal.jsx
│   │   ├── Input.jsx
│   │   ├── Layout.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── Sidebar.jsx
│   │   └── StatCard.jsx
│   ├── context/         # React Context
│   │   └── AuthContext.jsx
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Contacts.jsx
│   │   ├── ContactDetail.jsx
│   │   ├── Deals.jsx
│   │   ├── DealDetail.jsx
│   │   ├── EmailCenter.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Profile.jsx
│   ├── services/       # API services
│   │   ├── api.js
│   │   ├── contactService.js
│   │   ├── dealService.js
│   │   └── emailService.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env.example        # Environment variables template
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features in Detail

### Authentication
- Login and register pages
- JWT token management
- Protected routes
- Auto-redirect on logout

### Dashboard
- Statistics cards (contacts, deals, revenue, pipeline)
- Recent contacts and deals
- Quick navigation

### Contact Management
- List all contacts with pagination
- Search contacts
- Add/edit/delete contacts
- Contact detail view
- Send emails to contacts
- Status management (lead, prospect, customer, inactive)

### Deal Management
- Pipeline view (drag-and-drop)
- List view
- Add/edit/delete deals
- Deal detail view with activities
- Stage management
- Revenue tracking

### Email Center
- View email history
- Email detail view
- Status tracking (sent, delivered, failed)
- Send emails from contact detail

### Profile
- Update user information
- Change password
- View account details

## Customization

### Colors

Update Tailwind colors in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',  // Change this
      secondary: '#8B5CF6', // And this
    },
  },
}
```

### API URL

Update in `.env`:

```env
VITE_API_URL=https://your-api-url.com/api
```

## Building for Production

1. Build the application:
```bash
npm run build
```

2. The build files will be in the `dist` directory

3. Deploy to your hosting provider

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
