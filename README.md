# share-frontend

This is the frontend for the share-application, built with Next.js and React. It is designed to work together with a [Kirby CMS backend](https://github.com/robertschnuell/kirby-backend) that provides the content API.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Access to the [kirby-backend](https://github.com/robertschnuell/kirby-backend) repository (see its README for setup instructions)

## Setup

1. **Clone the repository**

   ```sh
   git clone https://github.com/robertschnuell/share-frontend.git
   cd share-frontend
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure environment**

   - Copy the example config file:

     ```sh
     cp config.js.example config.js
     ```

   - Edit `config.js` to match your backend API host and port if needed.

4. **Start the development server**

   ```sh
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

5. **Build for production**

   To create an optimized production build:

   ```sh
   npm run build
   npm start
   ```

## Backend Dependency

This frontend **requires** the [kirby-backend](https://github.com/robertschnuell/share-kirby-backend) to be running and accessible. Please follow the setup instructions in that repository to get the backend API up and running.

## Project Structure

- `src/pages/` – Next.js pages (routes)
- `src/components/` – React components
- `public/` – Static assets
- `config.js` – Runtime configuration (API endpoints, etc.)

## Notes

- Make sure the backend API is running and accessible at the host/port specified in your `config.js`.
- If you make changes to the backend API, you may need to restart the frontend server.

## License

MIT License

## Customizing the Color Schema

To change the color schema of the frontend:

1. Open `src/styles.css`.
2. Locate the `@layer base { :root { ... } }` section near the top of the file.
3. Edit the CSS variables such as `--background`, `--foreground`, `--primary`, etc. For example:
   ```css
   --background: 255 255 255;
   --foreground: 0 0% 10%;
   ```
   You can use RGB, HSL, or HEX values.
4. Save the file and reload the app to see your changes.

For legacy support, you may also update the variables in the `:root` section further down in the same file.

### Customizing with `tailwind.config.js`

You can further individualize your color schema by editing `tailwind.config.js`:

1. Open `tailwind.config.js` in the project root.
2. In the `theme.extend.colors` section, add or override color definitions to match your branding or preferences. For example:
   ```js
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         colors: {
           brand: {
             light: '#f0e6f6',
             DEFAULT: '#8b5cf6',
             dark: '#4c1d95',
           },
           // Override default colors if needed
           background: 'rgb(255,255,255)',
           foreground: 'hsl(0, 0%, 10%)',
         },
       },
     },
     // ...existing config...
   }
   ```
3. Use your custom colors in your components with Tailwind classes, e.g. `bg-brand`, `text-brand-dark`, etc.
4. Restart the dev server if it's running to apply changes.

Refer to the [Tailwind CSS documentation](https://tailwindcss.com/docs/theme#extending-the-default-theme) for more details on customizing your Tailwind setup.
