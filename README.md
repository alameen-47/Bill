# Bill - Smart Billing & Receipt Management App

<div align="center">

![Bill App](https://img.shields.io/badge/React%20Native-0.81.1-blue)
![Platform-Android](https://img.shields.io/badge/Platform-Android-green)
![Platform-iOS](https://img.shields.io/badge/Platform-iOS-gray)
![License-MIT](https://img.shields.io/badge/License-MIT-yellow)

</div>

## 📱 Overview

**Bill** is a powerful mobile application for businesses to create, manage, and print bills and receipts. With integrated Bluetooth thermal printer support, you can instantly print professional receipts directly from your mobile device.

## ✨ Key Features

### 🧾 Bill Management
- Create new bills with ease
- Add multiple products to a single bill
- Automatic total calculation with tax support
- View all bills history
- Search and filter bills by date, customer, or amount

### 📦 Product Management
- Add, edit, and delete products
- Organize products into categories
- Set custom prices and product codes
- Track product inventory

### 🖨️ Receipt Printing
- Connect via Bluetooth thermal printer
- Print professional receipts instantly
- Customizable receipt templates
- QR code support on receipts

### 📊 Reports & Analytics
- Daily, weekly, and monthly sales reports
- Visual graphs and charts
- Export data for accounting

### 👥 User Management
- Secure authentication system
- User profiles with settings
- Password recovery functionality

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: v20 or higher
- **npm** or **yarn**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development)
- **React Native CLI** installed globally

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bill
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will automatically install backend dependencies as well.

3. **Start the backend server**
   ```bash
   # Terminal 1 - Start backend
   npm run backend
   ```

4. **Run the app**
   
   For Android:
   ```bash
   npm run android
   ```
   
   For iOS:
   ```bash
   npm run ios
   ```

### Environment Setup

#### Backend Configuration
The backend is located in the `/backend` directory. It uses MongoDB for data storage.

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/billapp
JWT_SECRET=your_secret_key_here
```

#### Database Setup
- Install MongoDB locally or use MongoDB Atlas
- Update the connection string in `backend/src/config/db.js`

## 📁 Project Structure

```
Bill/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── src/                     # React Native source code
│   ├── api/               # API configuration
│   ├── assets/            # Images and icons
│   ├── components/        # Reusable UI components
│   ├── context/           # React Context providers
│   ├── navigation/        # Navigation configuration
│   ├── reciept/           # Receipt templates
│   ├── screens/           # App screens
│   └── utilities/         # Utility functions
├── backend/               # Node.js backend
│   └── src/
│       ├── config/       # Database configuration
│       ├── controllers/  # Route controllers
│       ├── models/       # Mongoose models
│       ├── routes/       # API routes
│       └── middlewares/  # Auth middleware
├── app.json               # App configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## 🛠️ Technology Stack

### Frontend
- **React Native** 0.81.1 - Cross-platform mobile framework
- **React Navigation** - Navigation system
- **NativeWind** - Tailwind CSS for React Native
- **Ant Design** - UI components
- **React Native Vector Icons** - Icon library
- **React Native Bluetooth Classic** - Bluetooth connectivity
- **React Native Thermal Printer** - Receipt printing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JSON Web Token** - Authentication

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| Login | User authentication |
| Signup | New user registration |
| Home | Dashboard with quick actions |
| New Bill | Create new bills |
| All Bills | View bill history |
| Products | Manage product inventory |
| Add Product | Add new products |
| Reports | Sales analytics |
| Settings | App configuration |
| Profile | User profile management |

## 🔧 Configuration

### Android Build

For release builds, update `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 2        // Increment for each release
        versionName "1.0.1"  // User-visible version
    }
}
```

### Bluetooth Printer Setup

1. Ensure Bluetooth is enabled on your device
2. Pair your thermal printer with Android/iOS
3. In app Settings, scan for available printers
4. Select and connect to your printer

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev)
- [Ant Design](https://reactnative.ant.design)
- [React Navigation](https://reactnavigation.org)
- [MongoDB](https://www.mongodb.com)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting Guide](#) (coming soon)
2. Open an issue on GitHub
3. Email: support@billapp.com

---

<div align="center">

**Made with ❤️ for businesses everywhere**

</div>

