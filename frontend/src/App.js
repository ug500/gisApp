

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


