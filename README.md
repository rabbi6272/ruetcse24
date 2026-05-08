# RUET CSE 24

RUET CSE 24 is a community web app for the Computer Science and Engineering 2024 batch of Rajshahi University of Engineering and Technology. It presents the batch identity, lets visitors browse student profiles, and gives students a simple way to create and update their own information.

## About the Project

This project was built to keep the RUET CSE 24 batch connected in one shared digital space. The homepage introduces the batch with a visual showcase, while the profiles section works as a student directory where classmates can find each other by name, roll, email, hobby, or contact information.

The app is designed for:

- Showcasing the RUET CSE 24 batch.
- Browsing student profiles in a clean directory.
- Helping students keep their personal information updated.
- Sharing basic contact and social information among classmates.
- Sending batch-related email updates when needed.

## Main Features

- Animated RUET CSE 24 landing page.
- Public student profile directory.
- Searchable profiles.
- Student profile creation.
- Student profile update using email and pincode.
- Profile picture upload.
- Account deletion option.
- Forgot-pincode flow.
- Batch email utility.
- Responsive design for mobile and desktop.

## Student Profile Information

Each profile can include:

- Full name
- Nickname
- Roll number
- Section
- Email address
- Mobile number
- Blood group
- Hobby
- Short bio
- Facebook profile
- Profile picture

## Pages

- `/` - Main landing page.
- `/profiles` - Student profile directory.
- `/profiles/create` - Create a new profile.
- `/profiles/update` - Login and update an existing profile.
- `/profiles/forgot-pincode` - Reset profile pincode.
- `/email-services` - Send batch email updates.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Required Configuration

The project needs environment variables for:

- Firebase
- Cloudinary
- Resend

Create a `.env.local` file in the project root and add the required values before running the full app locally.

## Project Purpose

The goal of this project is simple: to create a useful, organized, and memorable online space for RUET CSE 24 students. It is both a batch showcase and a practical profile directory for classmates.
