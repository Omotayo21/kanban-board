# Product Management Web App
Overview
This project is a product management web application built using Next.js, TypeScript, Redux, and Tailwind CSS. The app allows users to manage products by adding, editing, and deleting them. The product listing is updated in real-time, reflecting the latest changes without requiring a page reload. The app also includes a product listing page with options to filter products by category or price, and product details can be viewed individually.

The application is designed for administrators or store managers, not for customers. Therefore, there is no shopping cart or order functionality. All product data is stored and managed using local storage, which persists even after the page is refreshed.

Setup and Running Locally
Prerequisites
Node.js (>= 14.x)
npm or yarn
Installation
Clone the repository:

```

git clone https://github.com/your-username/product-management-app.git
cd product-management-app
```
Install dependencies:

```

npm install
# or
yarn install
```
### Start the development server:

bash
Copy code
npm run dev
# or
yarn dev
Open the app in your browser:

Visit http://localhost:3000 to see the application running.

Building for Production
To create an optimized production build, run:

bash
Copy code
npm run build
# or
yarn build
This will generate the optimized output in the .next directory.

Running the Production Build
To start the production server, run:

bash
Copy code
npm run start
# or
yarn start
Design Decisions, Optimizations, and Trade-offs
State Management: Redux Toolkit was chosen for state management due to its simplicity and ease of use. It provides a clear and predictable state flow, which is essential for managing product data consistently across the app.

Local Storage: Local storage was used to persist product data, allowing users to see the same data even after a page reload. This approach was chosen for simplicity since a database was not required. However, local storage is not suitable for large-scale production apps where data needs to be shared across multiple devices.

UI/UX: The UI is designed to be minimal and functional. Tailwind CSS was used to quickly style components while maintaining a consistent design. The design prioritizes usability, ensuring that the core features (adding, editing, deleting, and viewing products) are easy to access and use.

Routing: Next.js provides built-in routing that was leveraged for navigating between pages, including the main product listing page and the product editing page.

Trade-offs: The use of local storage makes the app lightweight and easy to set up, but it limits data sharing between users. Additionally, since there is no server-side data, the application doesn't handle concurrent data changes from multiple users, which could be an issue in a multi-user environment.

SEO Handling
SEO (Search Engine Optimization) was considered in the following ways:

Page Titles and Meta Tags: Each page has a descriptive title, and meta tags can be customized for SEO. For instance, the product detail pages could include specific meta descriptions for better search engine indexing.

Next.js's Built-in SEO Features: Next.js provides server-side rendering, which improves the crawlability of the website by search engines. This ensures that the content is indexed properly, and the app is visible in search engine results.

Semantic HTML: The app uses semantic HTML elements, which helps search engines understand the structure of the content, further enhancing SEO.