# Whirlybird

A Next.js application for managing and displaying bay information across multiple hangars. The system supports dynamic URL rotation and administrative controls for bay management.

## Features

- **Bay Information Display**: View detailed bay information including serial numbers and customer details
- **Dynamic URL Rotation**: Automatically rotate through configured URLs for each bay
- **Admin Interface**: Manage bay configurations, URLs, and settings
- **Excel Integration**: Data management through Excel file integration
- **Responsive Design**: Built with Tailwind CSS for a responsive layout

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Excel file with bay configuration (placed in `data/bays.xlsx`)

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

## Usage

### Viewing Bay Information

Access bay information by navigating to:
```
http://localhost:3000/?bay=[bay-number]&hangar=[hangar-number]
```
Example: `http://localhost:3000/?bay=2-1&hangar=1`

### Admin Interface

Access the admin interface at `/admin` to:
- Manage bay configurations
- Edit URL rotations
- Update system settings
- Modify bay rankings

## Project Structure

- `/app` - Main application code
  - `/admin` - Administrative interface components
  - `/api` - API routes for data management
  - `/components` - Reusable React components
  - `/utils` - Utility functions including Excel operations
- `/data` - Data storage (Excel files and settings)
- `/public` - Static assets

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [XLSX](https://www.npmjs.com/package/xlsx) - Excel file operations
- [Headless UI](https://headlessui.com/) - UI components

## Development

The application uses Next.js 15 with the App Router and React Server Components. Key features include:

- TypeScript for type safety
- Tailwind CSS for styling
- Excel file integration for data management
- Server-side rendering for optimal performance

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

## Deployment

The application can be deployed using:

```bash
npm run build
npm run start
# or
yarn build
yarn start
```
