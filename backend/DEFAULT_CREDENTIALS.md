# Default Admin Credentials

After running the user seeder, you can log in with these default credentials:

## Admin Account
- **Email:** `admin@admin.com`
- **Password:** `admin123`
- **Role:** Admin (full access)

## Employee Account (Optional)
- **Email:** `employee@employee.com`
- **Password:** `employee123`
- **Role:** Employee (limited access)

## Database Configuration

The application is configured to use the database name: **`db1`**

### For MongoDB Atlas (Cloud)

Make sure your `.env` file includes the database name in the connection string:

**Option 1: Include database name in connection string (Recommended)**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/db1?retryWrites=true&w=majority
```

**Option 2: Let the app add it automatically**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net?retryWrites=true&w=majority
MONGO_DB_NAME=db1
```

### For Local MongoDB

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=db1
```

## Running the Seeder

To create the default admin user, run:
```bash
cd backend
node seeders/userSeeder.js
```

**Note:** The seeder will only create users if no admin user exists in the database.

