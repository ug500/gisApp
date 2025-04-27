# **A.I.A.S \- Alien Invasion Alert System** 

### 

### **מערכת התראה וניטור של פלישות חייזרים 🛸**

---

## **📢 ברוכים הבאים ל־A.I.A.S \!**

מערכת חכמה ומתקדמת המנטרת בזמן אמת פעילות פלישות 👽 ומציגה התראות חיות,  
 מקלטים קרובים, נתוני פלישות היסטוריות, ועוד — בעיצוב טקטי מתקדם.

---

## 

## **🚀 רכיבי המערכת**

* **Frontend (React.js)**: ממשק מפה חי הכולל שליטה בשכבות, לוגים עדכניים, התרעות טקטיות, מצב לילה וסטטיסטיקות חייזרים.

* **Backend Node.js \+ Express**: שרת מקומי לניהול נתוני פלישות, מקלטים ורשויות.

* **API חיצוני**:

  * נתוני פלישה חיים: [`https://invasion-api.onrender.com`](https://invasion-api.onrender.com)

  * נתוני מזג אוויר: [`https://openweathermap.org`](https://openweathermap.org)

* **MongoDB**: בסיס נתונים מרוחק להיסטוריה ומשתמשים.


## 

## **🛰️ תצוגת צד ימין (Right Panel)**

* שכבת רשויות ועיריות \+ התראות לפי אזורים

* ניטור נחיתות צלחות מעופפות ותנועת חייזרים

* מקלטים ציבוריים

* חיפוש מקלט קרוב

* היסטוריית פלישות

* סטטוס פלישות לפי רשויות

* נתוני מזג אוויר (שכבת רוח)

* מצב לילה 🌙

---

## **🎛️ תצוגת צד שמאל (Left Panel)**

* מונה נחיתות וחייזרים

* נורות רמת התראה

* לוג פלישות לפי רשויות

* לוג חייזרים חיים על הקרקע

* כפתורי שליטה בתצוגה ובקול

---

## **📚 תצוגת בר תחתון (Bottom Bar)**

* חיפוש לפי נחיתה

* עדכוני מצב מהשטח

* 

## 

## **🛠️ טכנולוגיות עיקריות**

* React \+ React-Leaflet

* Node.js \+ Express

* Axios

* OSRM Routing API

* Turf.js

* GeoJSON

* JWT (JSON Web Token) מוצפן

* bcryptjs (להצפנת סיסמאות)

* 

---

## 

## **➕ תוספות**

* הוספת שכבת הרשאות משתמשים (JWT Encrypted):

  * התחברות כ־Admin, משתמש רגיל או הרשמה.

  * שמירה/שליפה של משתמשים מתוך MongoDB (`Collection: users`).

  * Middleware שמגן על API Routes הדורשים Authentication.

* כללי ולוגיקת ולידציה חדשה ב־Frontend.

* ולידציה נוספת ב־Backend (באמצעות `express-validator`).

## 

## **📁 מבנה הפרויקט**

`/frontend — צד לקוח (React)`  
`/backend  — צד שרת (Node.js)`

### **קבצים עיקריים:**

* `App.js`

* `TacticalLayout.js`

* `MainMap.js`

* `InvasionLayer.js`

* `LayerToggle.js`

* `SidePanelLeft.js`

* `SidePanelRight.js`

---

## **🚀 הוראות הפעלה מקומית**

### **התקנת Frontend:**

`cd frontend`  
`npm install`  
`npm start`

---

### **התקנת Backend:**

`cd backend`  
`npm install`

* עדכן קובץ `.env`:

`PORT=5000`  
`MONGODB_URI=your_mongodb_connection_string_here/Invasion`  
`JWT_SECRET=Your_Secret_Key_Here`

`# הרשאות לאדמין`  
`ADMIN_USERNAME=Your_Admin_Username`  
`ADMIN_PASSWORD=Your_Admin_Password`

* התקנת תלויות נוספות:

`npm install bcryptjs jsonwebtoken express-validator`

* הרצת השרת:

`node index.js`

---

## 

## **🔄 עדכון מיקומי פלישות (נעשה אוטומטית מהאפליקציה)**

* קריאת POST לכתובת:

`https://invasion-api.onrender.com/api/invasion`

---

# 

# **👽 בהצלחה בהגנה על כדור הארץ\!**

