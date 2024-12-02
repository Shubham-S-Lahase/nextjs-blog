This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Features
* View a list of blog posts with titles, authors, and excerpts.
* View detailed pages for each post, including full content and comments.
* Comment on each post.
* JWT-based authentication for secure user sessions.
* Role-based access control for admins and general users.

Approach
User Authentication:
Implemented API endpoints for registration and login.
Developed frontend components for testing authentication functionality.

Posts Functionality:
Implemented CRUD operations for posts with corresponding API endpoints.
Created components for viewing posts and tested functionality.

Role-Based Access Control:
Enhanced the login process to allow users to log in as either regular users or admins.

Code Refactoring:
Refactored Post Page code to maintain modularity and improve readability.

Admin Features:
Implemented functionality for admins to delete any post (no editing capabilities included).

Comment Functionality:
Added comment capabilities for user interaction with posts.

UI Enhancements:
Improved CSS for better aesthetics and responsiveness.
Refined typography for a better reading experience.
Implemented a dark/light theme toggle for accessibility.

Mobile Experience:
Designed a mobile-friendly header for improved navigation on smaller devices.

Overall Strategy:
Defined APIs for each functionality.
Tested APIs using Postman before creating minimal UI components.
Enhanced UI after verifying functionality.

Challenges
Permissions and Access Control:
Difficulty implementing role-based permissions for actions like deleting posts and comments.

Maintaining Relationships:
Challenges in managing relationships between authors, comments, and posts during user authentication.
Required decoding JWT tokens and extracting necessary information.

Comments Functionality:
Complexities in allowing normal users to edit/delete their comments while enabling admins to delete any comment.
Needed to compare user IDs to the author's ID for conditional rendering of edit/delete buttons.

Learning Curve with React Query:
First-time use of React Query required additional time to understand its usage and best practices.

Possible Improvements
Testing:
Implement unit tests for API routes and critical components to ensure reliability.

Error Handling:
Enhance error handling to provide clear feedback to users during failures.

User Experience:
Introduce smooth transitions and animations during pagination and other user interactions for a more engaging experience.