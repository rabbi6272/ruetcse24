# Student Manager - Next.js TypeScript Application

A modern student management system built with Next.js, TypeScript, and CSS Modules featuring a dark cyberpunk UI design.

## Features

- ✅ **Read & Display** - Beautiful card-based grid layout
- 🔍 **Search & Filter** - Real-time search and section filtering
- ➕ **Add Students** - Clean modal form for adding new students
- ✏️ **Edit Students** - Edit existing student information
- 🗑️ **Delete Students** - Remove students with confirmation
- 📊 **Statistics** - Live stats dashboard
- 💾 **Export Data** - Download updated JSON file

## Project Structure

```
your-nextjs-app/
├── app/
│   ├── globals.css                    # Global styles with dark theme
│   ├── layout.tsx                     # Root layout
│   └── student-manager/
│       ├── page.tsx                   # Main component
│       └── StudentManager.module.css  # Component styles
└── public/
    └── StudentInfo.json               # Student data
```

## Setup Instructions

### 1. File Placement

Place the files in your Next.js project:

- `page.tsx` → `/app/student-manager/page.tsx`
- `StudentManager.module.css` → `/app/student-manager/StudentManager.module.css`
- `globals.css` → `/app/globals.css`
- `StudentInfo.json` → `/public/StudentInfo.json`

### 2. Update Root Layout (if needed)

Make sure your `app/layout.tsx` imports the global CSS:

```tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 3. Install Dependencies

Make sure you have the required dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 5. Access the Application

Open your browser and navigate to:

```
http://localhost:3000/student-manager
```

## Usage

### Adding a Student

1. Click the "+ Add Student" button
2. Fill in the required fields (Full Name, Nickname, Email, Pincode)
3. Optionally add Section, Hobby, Bio, Facebook Profile, and Profile Picture URL
4. Click "Save Student"

### Editing a Student

1. Click the "Edit" button on any student card
2. Modify the information in the modal form
3. Click "Save Student"

### Deleting a Student

1. Click the "Delete" button on any student card
2. Confirm the deletion in the popup

### Searching and Filtering

- Use the search box to find students by name, email, nickname, or hobby
- Use the section dropdown to filter by section (A, B, C, or No Section)
- Both filters work together for more precise results

### Exporting Data

When you add, edit, or delete a student, the system will automatically trigger a download of the updated `StudentInfo.json` file. Save this file to your `/public` folder to persist the changes.

## TypeScript Types

The application uses the following main types:

```typescript
interface Student {
  bio?: string;
  bloodGroup?: string;
  createdAt: number;
  email: string;
  fbProfile?: string;
  fullName: string;
  hobby?: string;
  mobileNumber?: string;
  nickname: string;
  pincode: string;
  profilePicture?: {
    publicId: string;
    url: string;
  };
  roll: string;
  sec?: string;
  updatedAt?: number;
}

interface StudentsData {
  [key: string]: Student;
}
```

## Design Features

- **Dark Cyberpunk Theme** - Modern dark UI with neon accents
- **Gradient Effects** - Beautiful gradient text and buttons
- **Smooth Animations** - Fade-in, slide, and hover effects
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Custom Typography** - Darker Grotesque & JetBrains Mono fonts
- **Glowing Effects** - Neon glow on hover and focus states

## Customization

### Colors

Edit the CSS variables in `globals.css`:

```css
:root {
  --bg-primary: #0a0e1a;
  --accent-primary: #00ffc6;
  --accent-secondary: #7c3aed;
  /* ... */
}
```

### Fonts

Change fonts in `globals.css` by updating the Google Fonts import.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
