import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogout = ({ children, timeout = 5 * 60 * 1000 }) => {
  const navigate = useNavigate();
  const timerRef = useRef();

  const logout = () => {
    localStorage.clear(); // Clear user data
    navigate('/');   // Redirect to login
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, timeout);
  };

  const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];

  useEffect(() => {
    resetTimer();

    const handleActivity = () => resetTimer();

    activityEvents.forEach(event =>
      window.addEventListener(event, handleActivity)
    );

    return () => {
      activityEvents.forEach(event =>
        window.removeEventListener(event, handleActivity)
      );
      clearTimeout(timerRef.current);
    };
  }, []);

  return children;
};

export default AutoLogout;
