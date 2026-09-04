# 1Fi EMI Commerce Platform

A full-stack ecommerce application where users can browse products, select variants, view EMI plans, calculate monthly installments, and submit EMI applications.

## Tech Stack

- Next.js
- React.js
- TypeScript
- Tailwind CSS
- NeonDB (PostgreSQL)
- Prisma

## Setup and Run

### 1. Clone the repository

```bash
git clone https://github.com/girimohit/1fi.git
cd 1fi
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
DATABASE_URL="your_postgresql_connection_string"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Seed the database

```bash
npx prisma db seed
```

### 7. Start the application

```bash
npm run dev
```

Open `http://localhost:3000`.

## API Endpoints

### Get Products

> GET /api/products

Optional filters:

> GET /api/products?category=smartphones \
> GET /api/products?search=iphone

Example response:

```json
{
  "success": true,
  "data": [
    {
      "id": "cm123",
      "name": "iPhone 17 Pro",
      "slug": "iphone-17-pro",
      "brand": "Apple",
      "category": {
        "name": "Smartphones",
        "slug": "smartphones"
      },
      "variants": [
        {
          "id": "var123",
          "title": "256 GB",
          "price": 129900,
          "mrp": 134900
        }
      ]
    }
  ]
}
```

### Get Categories

> GET /api/categories

Example response:

```json
{
  "success": true,
  "data": [
    {
      "id": "cat123",
      "name": "Smartphones",
      "slug": "smartphones"
    },
    {
      "id": "cat456",
      "name": "Laptops",
      "slug": "laptops"
    }
  ]
}
```

### Get Product

> GET /api/products/:slug

Example:
> GET /api/products/iphone-17-pro

Example response:

```json
{
  "success": true,
  "data": {
    "name": "iPhone 17 Pro",
    "slug": "iphone-17-pro",
    "brand": "Apple",
    "variants": [
      {
        "title": "256 GB",
        "price": 129900,
        "mrp": 134900,
        "emiPlans": [
          {
            "tenureMonths": 6,
            "interestRate": 0,
            "cashbackAmount": 2000
          }
        ]
      }
    ]
  }
}
```

### Submit EMI Application

> POST /api/applications

Example request:

```json
{
  "variantId": "var123",
  "emiPlanId": "emi123",
  "applicantName": "John Doe",
  "applicantPhone": "9876543210",
  "applicantEmail": "john@example.com"
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "id": "app123",
    "status": "SUBMITTED"
  }
}
```

| Model             | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| `Category`        | Product categories                             |
| `Product`         | Product information                            |
| `ProductVariant`  | SKU, pricing, images, attributes and inventory |
| `EmiPlan`         | EMI tenure, interest rate and cashback         |
| `PlanApplication` | EMI application details and status             |

`ProductVariant.attributes` uses JSON for flexible variant attributes such as storage, RAM, size, or material.


> The database schema and seed file have been added to the prisma folder