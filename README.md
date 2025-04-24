# 👽 Alien Invasion Simulator 🛸

סימולציית פלישה חיה של חייזרים לתוך מדינת ישראל — בזמן אמת, על גבי מפה אינטראקטיבית.

## 🗺️ איך זה עובד?

- לחיצה על המפה קובעת את **נקודת הנחיתה** של הצלחת המעופפת 🛸
- נוצרות 8 יחידות חייזרים 👽 שמתפשטות לאורך צירי תנועה אמיתיים בישראל (OSRM)
- החייזרים נעים במהירות של כ־50 קמ״ש עם **אנימציה חלקה**
- מיקומים נשלחים בכל שנייה ל־API ב־GeoJSON
- תצוגת חייזרים כוללת אימוג'י + מספר סידורי ברור
- ניתן לשלוף את הנתונים מה־API ולנתח בזמן אמת

---

## 🧰 טכנולוגיות

- React + React Leaflet
- Node.js + Express
- Axios
- OSRM Routing API
- Turf.js (אם נשתמש בהמשך)
- GeoJSON
- JWT Encrypted
- Implementing the bcrypt key derivation function, used for password hashing  

---

## תוספות 
Adding a JWT Encrypted User Login Layer to the System Log in as an Administrator or a Regular User or Register as a New User
- Handle user authentication (login/register) using JWT and bcrypt.
- Store/retrieve Users data using MongoDB, Collection users MONGODB_URI.
- Add middleware allows you to easily configure which API routes require the user to be logged in. Any path configured to use this middleware will be protected, and the code that handles the path can
trust that req.user contains the authenticated user information.
- The new validation rules and logic In Frontend.
- The new validation rules and logic using express-validator In Backend.


## 🚀 הפעלה מקומית

### 📁 התקנת פרונטאנד:

```bash
cd frontend
npm install
npm start

cd backend
npm install
node index.js

### 📁 התקנת בקאנד:
cd backend
Update .env file:
Make sure you have MONGODB_URI and add JWT_SECRET:
dotenv


# .env file
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here/Invasion

JWT_SECRET=Your Secret-Key Here 

# Add these lines for admin credentials
ADMIN_USERNAME=Your Admin Username Here
ADMIN_PASSWORD=Your Admin Password Here


Install Dependencies:
Navigate to your backend directory in the terminal and run:
bash
npm install
npm install bcryptjs jsonwebtoken

# Install express-validator
npm install express-validator

Run the Server
bash
node index.js



עדכון מיקומים (מתבצע אוטומטית מהאפליקציה):
POST https://invasion-api.onrender.com/api/invasion
