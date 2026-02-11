# Quick Start: Create Super Admin

## 🚀 Fastest Way (Recommended)

### Step 1: Set Environment Variables (Optional)

Add these to your `.env` file if you want custom credentials:

```bash
SUPER_ADMIN_EMAIL=admin@tmgglobal.ae
SUPER_ADMIN_PASSWORD=YourSecurePassword123!
SUPER_ADMIN_NAME=Super Admin
```

**If you skip this step**, the script will use defaults:

- Email: `admin@tmgglobal.ae`
- Password: `Admin@123`
- Name: `Super Admin`

### Step 2: Run the Seed Script

```bash
npm run seed:admin
```

### Step 3: Login

Use the credentials you set (or the defaults) to login to your admin panel.

### Step 4: Change Password

**IMPORTANT:** Change your password immediately after first login!

---

## 📋 What the Script Does

✅ Checks if super admin already exists (prevents duplicates)  
✅ Validates email is not already in use  
✅ Hashes password securely with bcrypt  
✅ Creates super admin with proper role and permissions  
✅ Provides detailed output and security reminders

---

## 🔒 Default Credentials

**⚠️ WARNING: Change these immediately!**

```
Email: admin@tmgglobal.ae
Password: Admin@123
```

---

## 🛠️ Troubleshooting

### "Super admin already exists"

✅ This is normal - the script prevents duplicates  
💡 To create a new one, delete the existing super admin from database first

### "Email already in use"

❌ Another user has this email  
💡 Use a different email or delete the existing user

### "MONGO_URL is not defined"

❌ Missing database connection string  
💡 Add `MONGO_URL` to your `.env` file

---

## 📚 More Information

For detailed documentation, see: `docs/SUPER_ADMIN_SETUP.md`

---

## ⚡ Alternative Methods

### Method 1: Direct Node Command

```bash
node scripts/seedSuperAdmin.js
```

### Method 2: With Custom Environment Variables

```bash
SUPER_ADMIN_EMAIL=custom@email.com SUPER_ADMIN_PASSWORD=CustomPass123! npm run seed:admin
```

### Method 3: Using Different .env File

```bash
# Create .env.admin with your credentials
node -r dotenv/config scripts/seedSuperAdmin.js dotenv_config_path=.env.admin
```

---

## 🎯 Next Steps After Creating Super Admin

1. ✅ Login to admin panel
2. ✅ Change password
3. ✅ Update profile information
4. ✅ Create additional admin users (with limited permissions)
5. ✅ Set up 2FA (if available)
6. ✅ Review security settings

---

## 💡 Pro Tips

- Use a password manager to generate and store strong passwords
- Never share super admin credentials
- Create separate admin accounts for each team member
- Regularly audit admin user access
- Enable audit logging for admin actions
