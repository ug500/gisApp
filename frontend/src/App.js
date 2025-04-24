// d:\full-gisapp\gisApp\frontend\src\App.js

import React, { useState, useEffect } from 'react';
import TacticalLayout from './components/TacticalLayout';
import AuthModal from './components/auth/AuthModal';
import authService from './services/authService';
import './App.css';

function App() {
  // --- Authentication State ---
  // currentUser מתחיל כ-null כברירת מחדל.
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null); // עדיין שימושי לשמור את הטוקן
  const [isLoading, setIsLoading] = useState(true); // עדיין שימושי למניעת הבהוב תוכן

  // --- Check for existing token on initial mount (Optional Enhancement) ---
  useEffect(() => {
    // אפשר לשמור את הטוקן אם נמצא, אך לא להגדיר את המשתמש עד לאימות מוצלח
    const storedToken = authService.getToken();
    if (storedToken) {
      setToken(storedToken);
      // *** הערה חשובה: ***
      // כאן המקום האידיאלי להוסיף קריאה לשרת
      // כדי לוודא שהטוקן השמור עדיין תקף.
      // אם השרת מאשר, אפשר לקרוא ל-authService.getCurrentUser()
      // ו-setCurrentUser(...) כדי לבצע כניסה אוטומטית.
      // לדוגמה:
      // authService.verifyToken(storedToken)
      //   .then(userData => {
      //     setCurrentUser(userData);
      //     // setToken(storedToken); // כבר מוגדר
      //   })
      //   .catch(() => {
      //     // הטוקן לא תקין, נקה אותו
      //     authService.logout();
      //     setToken(null);
      //     setCurrentUser(null);
      //   })
      //   .finally(() => setIsLoading(false));
      //
      // מכיוון שאין לנו כרגע אימות מול השרת, פשוט נסיים את הטעינה.
      setIsLoading(false);
    } else {
      // אין טוקן שמור, סיים טעינה
      setIsLoading(false);
    }
  }, []); // הרצה פעם אחת בטעינה

  // --- Authentication Handlers ---
  const handleAuthSuccess = (user, receivedToken) => {
    // זו הדרך העיקרית להגדיר את המשתמש כ"מחובר"
    authService.storeLogin(user, receivedToken); // ודא שהשירות שומר את הפרטים
    setCurrentUser(user);
    setToken(receivedToken);
    setIsLoading(false); // ודא שהטעינה הסתיימה אם היא עדיין פעילה
  };

  const handleLogout = () => {
    authService.logout(); // השירות מנקה את localStorage
    setCurrentUser(null);
    setToken(null);
    // אין צורך לשנות את isLoading כאן
  };

  // --- Render Loading State ---
  if (isLoading) {
    // הצג מסך טעינה בזמן הבדיקה הראשונית (או אימות טוקן עתידי)
    return <div className="loading-screen">טוען אפליקציה...</div>;
  }

  // --- Render Main Application ---
  return (
    <div className="App">
      {!currentUser ? (
        // --- אם המשתמש *לא* מחובר (currentUser הוא null) ---
        // הצג את AuthModal.
        // onAuthSuccess יעדכן את currentUser ויגרום לרינדור מחדש.
        <AuthModal
          onAuthSuccess={handleAuthSuccess}
          // אין צורך ב-onClose אם הכניסה היא חובה לצפייה ב-TacticalLayout
         />
      ) : (
        // --- אם המשתמש *כן* מחובר ---
        // הצג את TacticalLayout.
        // העבר את פרטי המשתמש ואת פונקציית ההתנתקות.
        <TacticalLayout
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;


// // d:\full-gisapp\gisApp\frontend\src\App.js

// import React, { useState, useEffect } from 'react';
// import TacticalLayout from './components/TacticalLayout';
// import AuthModal from './components/auth/AuthModal';
// import authService from './services/authService';
// import './App.css';

// function App() {
//   // --- Authentication State ---
//   const [currentUser, setCurrentUser] = useState(null);
//   // קוראים את הטוקן מהאחסון רק פעם אחת בהתחלה
//   const [token, setToken] = useState(() => authService.getToken());
//   const [isLoading, setIsLoading] = useState(true); // מתחילים במצב טעינה

//   // --- Verify existing token with backend on initial mount ---
//   useEffect(() => {
//     // אין צורך לקרוא שוב את הטוקן כאן, הוא כבר ב-state
//     console.log('בודק טוקן בטעינה:', token ? 'נמצא' : 'לא נמצא');

//     if (token) {
//       // נמצא טוקן ב-state, נסה לאמת אותו מול השרת
//       // החלף את 'getProfile' בשם הפונקציה הנכונה ב-authService שלך
//       // שאחראית על אימות הטוקן מול השרת (למשל, verifyToken)
//       authService.getProfile()
//         .then(userData => {
//           // הטוקן תקין והשרת החזיר פרטי משתמש
//           console.log('אימות טוקן מול השרת הצליח, פרטי משתמש:', userData);
//           // אין צורך לעדכן את הטוקן ב-state, הוא כבר שם
//           setCurrentUser(userData); // הגדר את המשתמש המחובר
//         })
//         .catch(error => {
//           // הטוקן לא תקין או שהייתה שגיאה בבקשה לשרת
//           console.error('שגיאה באימות הטוקן מול השרת:', error);
//           authService.logout(); // נקה את הטוקן הלא תקין מהאחסון
//           setToken(null);       // נקה את הטוקן מה-state
//           setCurrentUser(null); // ודא שאין משתמש מחובר ב-state
//         })
//         .finally(() => {
//           // בכל מקרה (הצלחה או כישלון), סיימנו את בדיקת הטעינה
//           setIsLoading(false);
//         });
//     } else {
//       // לא נמצא טוקן ב-state (ולכן גם לא באחסון)
//       console.log('לא נמצא טוקן, נדרשת התחברות.');
//       setIsLoading(false); // סיים טעינה, המשתמש יראה את AuthModal
//     }
//     // התלות ב-token כאן היא טכנית, כי אנו קוראים אותו מחוץ ל-useEffect
//     // אך מכיוון שה-useEffect רץ רק פעם אחת (בגלל []), זה לא ישפיע.
//     // אם תוציא את קריאת הטוקן מחוץ ל-useState, תצטרך להוסיף אותו כתלות.
//   }, []); // הרצה פעם אחת בטעינה ראשונית

//   // --- Authentication Handlers ---
//   const handleAuthSuccess = (user, receivedToken) => {
//     // פונקציה זו נקראת *לאחר* התחברות מוצלחת דרך AuthModal
//     console.log('התחברות מוצלחת דרך AuthModal:', user);
//     // ודא ש-AuthModal קורא ל-authService.storeLogin(user, receivedToken)
//     // כדי לשמור את הפרטים החדשים ב-localStorage
//     setToken(receivedToken); // עדכן את הטוקן ב-state
//     setCurrentUser(user);    // עדכן את המשתמש ב-state
//     setIsLoading(false);     // ודא שהטעינה הסתיימה
//   };

//   const handleLogout = () => {
//     console.log('מבצע התנתקות...');
//     authService.logout(); // השירות מנקה את localStorage
//     setCurrentUser(null);
//     setToken(null);
//   };

//   // --- Render Loading State ---
//   if (isLoading) {
//     // הצג מסך טעינה בזמן בדיקת הטוקן מול השרת
//     return <div className="loading-screen">מאמת נתונים מול השרת...</div>;
//   }

//   // --- Render Main Application ---
//   return (
//     <div className="App">
//       {!currentUser ? (
//         // --- אם המשתמש *לא* מחובר (currentUser הוא null) ---
//         <AuthModal onAuthSuccess={handleAuthSuccess} />
//       ) : (
//         // --- אם המשתמש *כן* מחובר ---
//         <TacticalLayout currentUser={currentUser} onLogout={handleLogout} />
//       )}
//     </div>
//   );
// }

// export default App;
