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

## 🚀 הפעלה מקומית

### 📁 התקנת פרונטאנד:

```bash
cd frontend
npm install
npm start

cd backend
npm install
node index.js

עדכון מיקומים (מתבצע אוטומטית מהאפליקציה):
POST https://invasion-api.onrender.com/api/invasion