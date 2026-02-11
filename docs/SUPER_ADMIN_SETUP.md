# Super Admin Setup Guide

## Overview

This guide explains the professional approaches to creating the first super admin user in your application.

## Professional Methods (Ranked by Best Practice)

### ⭐ Method 1: Database Seeding Script (RECOMMENDED)

**Best for:** Production and development environments
**Security:** High
**Automation:** Excellent

#### Advantages:

- ✅ Version controlled
- ✅ Repeatable and consistent
- ✅ Can be run in CI/CD pipelines
- ✅ Passwords are hashed automatically
- ✅ Easy to reset/recreate environments
- ✅ No manual database access needed
- ✅ Prevents typos and human errors

#### How to Use:

```bash
# Run the seeding script
npm run seed:admin

# Or directly with node
node scripts/seedSuperAdmin.js
```

#### When to Use:

- Initial project setup
- Setting up new environments (staging, production)
- Resetting development database
- Automated deployments

---

### Method 2: Admin Registration Endpoint (One-Time Use)

**Best for:** Initial setup with custom credentials
**Security:** Medium (must be disabled after use)

#### Advantages:

- ✅ Allows custom email/password
- ✅ Uses existing API infrastructure
- ✅ No direct database access needed

#### Disadvantages:

- ⚠️ Must be secured or disabled after first use
- ⚠️ Potential security risk if left enabled

#### Implementation:

Create a special registration endpoint that:

1. Checks if any super admin exists
2. If not, allows creation
3. Auto-disables after first super admin is created

---

### Method 3: Database GUI Tools (MongoDB Compass, Studio 3T)

**Best for:** Quick testing, emergency access
**Security:** Low (manual password hashing required)

#### Advantages:

- ✅ Quick for one-time setup
- ✅ Visual interface
- ✅ No code changes needed

#### Disadvantages:

- ❌ Not repeatable
- ❌ Prone to human error
- ❌ Password must be manually hashed
- ❌ Not version controlled
- ❌ Not suitable for production

#### Steps:

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `users` collection
4. Insert document manually (see example below)

---

### Method 4: MongoDB Shell (mongosh)

**Best for:** Server environments without GUI
**Security:** Medium

#### Advantages:

- ✅ Works on servers without GUI
- ✅ Can be scripted

#### Disadvantages:

- ❌ Requires manual password hashing
- ❌ Not as user-friendly

---

## Recommended Approach: Database Seeding

### Why Seeding is Best Practice?

1. **Version Control**: The seed script is committed to your repository
2. **Environment Parity**: Same admin user across dev, staging, and production
3. **Automation**: Can be integrated into deployment pipelines
4. **Security**: Passwords are properly hashed using bcrypt
5. **Idempotent**: Can be run multiple times safely (checks if admin exists)
6. **Documentation**: The script itself documents the initial user setup

### Industry Standard Workflow

```
Development → Staging → Production
     ↓            ↓          ↓
  Seed Script  Seed Script  Seed Script
```

## Security Best Practices

### 1. Environment Variables

**NEVER** hardcode credentials in the seed script:

```javascript
// ❌ BAD
const email = "admin@example.com";
const password = "admin123";

// ✅ GOOD
const email = process.env.SUPER_ADMIN_EMAIL;
const password = process.env.SUPER_ADMIN_PASSWORD;
```

### 2. Different Credentials Per Environment

**.env.development**

```
SUPER_ADMIN_EMAIL=dev@tmg.com
SUPER_ADMIN_PASSWORD=DevPassword123!
```

**.env.production**

```
SUPER_ADMIN_EMAIL=admin@tmgglobal.ae
SUPER_ADMIN_PASSWORD=<strong-unique-password>
```

### 3. Password Requirements

- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Use a password manager
- Change default password immediately after first login

### 4. Post-Setup Actions

After creating super admin:

1. ✅ Login and verify access
2. ✅ Change password through the application
3. ✅ Enable 2FA (if available)
4. ✅ Remove or secure the seeding script in production
5. ✅ Create additional admin users with limited permissions
6. ✅ Never share super admin credentials

## Manual Database Entry (Emergency Only)

If you must manually insert via MongoDB Compass:

### Step 1: Hash the Password

```javascript
// Run this in Node.js REPL or a temporary script
const bcrypt = require("bcrypt");
const password = "YourSecurePassword123!";
bcrypt.hash(password, 10).then((hash) => console.log(hash));
```

### Step 2: Insert Document

```json
{
  "name": "Super Admin",
  "email": "admin@tmgglobal.ae",
  "password": "$2b$10$hashed_password_here",
  "role": "superadmin",
  "isActive": true,
  "verify": true,
  "createdAt": "2026-02-10T07:19:36.000Z",
  "updatedAt": "2026-02-10T07:19:36.000Z"
}
```

## Comparison Table

| Method            | Security   | Repeatability | Automation | Recommended |
| ----------------- | ---------- | ------------- | ---------- | ----------- |
| Seeding Script    | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐ | ✅ YES      |
| One-Time Endpoint | ⭐⭐⭐     | ⭐⭐⭐        | ⭐⭐⭐⭐   | ⚠️ OK       |
| MongoDB Compass   | ⭐⭐       | ⭐            | ⭐         | ❌ NO       |
| MongoDB Shell     | ⭐⭐⭐     | ⭐⭐          | ⭐⭐⭐     | ⚠️ OK       |

## What Professional Developers Do

### Startups & Small Teams

- Use seeding scripts for initial setup
- Store credentials in password managers
- Use environment variables for different environments

### Medium Companies

- Automated seeding in CI/CD pipelines
- Separate admin users for each team member
- Regular security audits
- Password rotation policies

### Enterprise

- Infrastructure as Code (IaC)
- Automated provisioning with Terraform/Ansible
- Secret management systems (HashiCorp Vault, AWS Secrets Manager)
- Multi-factor authentication required
- Role-based access control (RBAC)
- Audit logging for all admin actions

## Quick Start (TL;DR)

```bash
# 1. Set environment variables
echo "SUPER_ADMIN_EMAIL=admin@tmgglobal.ae" >> .env
echo "SUPER_ADMIN_PASSWORD=YourSecurePassword123!" >> .env

# 2. Run the seed script
npm run seed:admin

# 3. Verify login through your application

# 4. Change password immediately after first login
```

## Troubleshooting

### "User already exists"

- This is normal if you've already run the seed script
- The script is idempotent and won't create duplicates

### "Password hashing failed"

- Check that bcrypt is installed: `npm install bcrypt`
- Verify Node.js version compatibility

### "Database connection failed"

- Verify MONGO_URL in .env file
- Check database is running
- Verify network connectivity

## Next Steps

After creating your super admin:

1. Create additional admin users with limited roles
2. Implement password change on first login
3. Set up audit logging
4. Configure session management
5. Implement 2FA (Two-Factor Authentication)
