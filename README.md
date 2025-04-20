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

---

## תוספות 
Adding a JWT Encrypted User Login Layer to the System Log in as an Administrator or a Regular User or    Register as a New User

## 🚀 הפעלה מקומית

### 📁 התקנת פרונטאנד:

```bash
cd frontend
npm install
npm start

### 📁 התקנת בקאנד:
cd backend
Update .env file:
Make sure you have MONGODB_URI and add JWT_SECRET:
dotenv
MONGODB_URI=your_mongodb_connection_string_here/Invasion
JWT_SECRET=replace_this_with_a_very_long_random_secure_string
PORT=5000

Install Dependencies:
Navigate to your backend directory in the terminal and run:
bash
npm install
npm install bcryptjs jsonwebtoken

Run the Server
bash
node index.js

עדכון מיקומים (מתבצע אוטומטית מהאפליקציה):
POST https://invasion-api.onrender.com/api/invasion