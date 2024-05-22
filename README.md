# Flat Sharing Application Assignment

## Live link

#### `https://flat-sharing-application-phl-2-ass-8.vercel.app/`

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/full-stack-module-31-assignment-8.git

   ```

2. Navigate to the project directory:

   ```bash
   cd full-stack-module-31-assignment-8

   ```

3. Set up the environment variable:

- create a `.env` file in the root directory.
- Define the following variables:

```bash
DATABASE_URL="postgresql://user_name:password@localhost:5432/database_name?schema=public"
PORT=3000
BCRYPT_SALT=10
JWT_ACCESS_SECRET="jwt-access-secret"
JWT_ACCESS_EXPIRATION="10d"
```

## How to Start the Server

To start the server, follow these steps:

- Open a terminal or command prompt.
- Navigate to the project directory.
- Run the following command to start the server:

```bash
npm run build # for build the project
npm run dev # for run the server
```

## `User API Routes:`

## Create Admin

- **Method: `POST`**
- **Endpoint:** `/user/admin`

#### Request

```json
{
  "password": "123456",
  "admin": {
    "userName": "admin",
    "email": "admin@example.com",
    "name": "Admin User",
    "mobileNo": "1234567890",
    "address": "123 Admin Street, Admin City"
  }
}
```

## Create Admin

- **Method: `POST`**
- **Endpoint:** `/user/customer`

#### Request

```json
{
  "password": "123456",
  "member": {
    "userName": "member",
    "email": "member@example.com",
    "name": "Member User",
    "mobileNo": "1234567890",
    "address": "123 Member Street, Member City"
  }
}
```

## Get User Profile

- **Method: `GET`**
- **Endpoint:** `/user/profile`

#### Headers

```bash
Authorization <ACCESS_TOKEN>
```

## Update User Profile

- **Method: `PUT`**
- **Endpoint:** `/api/profile`

#### Request

```json
{
  "bio": "I am a developer"
  // other fields
}
```

## `Auth API Routes:`

## Login User

- **Method: `POST`**
- **Endpoint:** `/api/login`

```json
{
  "email": "sakib@gmail.com",
  "password": "123456"
}
```

## `Flats API Routes:`

## Add Flat

- **Method: `POST`**
- **Endpoint:** `/api/flats`

#### Headers

```bash
Authorization <ACCESS_TOKEN>
```

#### Request

```json
{
  "squareFeet": 1200,
  "totalBedrooms": 2,
  "totalRooms": 4,
  "utilitiesDescription": "Includes water and electricity",
  "location": "123 Main Street, Cityville",
  "description": "Cozy apartment with ample natural light and modern amenities.",
  "rent": 1500,
  "advanceAmount": 2000
}
```

## Get Flats

- **Method: `GET`**
- **Endpoint:** `/api/flats`

#### Query Parameters for the API

- **searchTerm:** User can search for flat by the searchTerm for any data which are stored are some specific fields. The fields are `location`, `description` and `utilitiesDescription`
- **page:** User can set the page number of the data showing page.
- **limit:** User can set the limit of the data showing in each page.
- **sortBy:** User can sort data on any field.
- **sortOrder:** User can set the sort order of the data. There are two type of sort order- `asc` and `desc`
- **fields:** User can search on any specific. Example: `?availability=true`

## Update Flat

- **Method: `PUT`**
- **Endpoint:** `/api/flats/:flatId`

#### Headers

```bash
Authorization <ACCESS_TOKEN>
```

#### Request

```json
{
  "location": "Mirput, Dhaka"
}
```

## `Booking API Routes`

## Add Flat Booking

- **Method: `POST`**
- **Endpoint:** `/api/booking-applications`

#### Headers

```bash
Authorization <ACCESS_TOKEN>
```

#### Request

```json
{
  "flatId": "b9964127-2924-42bb-9970-60f93c016ghs"
}
```

## Get Flat Bookings

- **Method: `GET`**
- **Endpoint:** `/api/booking-requests`

#### Headers

```bash
Authorization <ACCESS_TOKEN>
```

## Update Flat Booking

- **Method: `PUT`**
- **Endpoint:** `/api/booking-requests/:bookingId`

#### Headers

```bash
Authorization <ACCESS_TOKEN>
```

#### Request

```json
{
  "status": "BOOKED"
}
```

## Technologies Used

- Node.js
- Express.js
- PostgreSQL as database
- Prisma(ORM)
- JWT for authentication
- Bcrypt for password hashing
- CORS for handling Cross-Origin Resource Sharing
- Dotenv for environment variables
