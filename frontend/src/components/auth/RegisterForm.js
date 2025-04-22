// d:\Shmulik-gisApp-V1\gisApp\frontend\src\components\auth\RegisterForm.js

import React, { useState, useEffect } from 'react';

// --- Validation Helper Functions ---

// Checks for letters and numbers, specific length
const validateAlphaNumeric = (value, minLength, maxLength) => {
  if (!value) return 'This field is required.';
  if (value.length < minLength || value.length > maxLength) {
    return `Must be between ${minLength} and ${maxLength} characters.`;
  }
  if (!/^[a-zA-Z0-9]+$/.test(value)) {
    return 'Only letters and numbers are allowed.';
  }
  return ''; // No error
};

// Basic email format check
const validateEmail = (email) => {
  if (!email) return 'Email is required.';
  // Simple regex, consider a more robust one if needed
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Please enter a valid email address.';
  }
  return ''; // No error
};

// Checks for letters, numbers, specific special chars, specific length
const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 6 || password.length > 15) {
    return 'Password must be between 6 and 15 characters.';
  }
  // Allows letters, numbers, and !@#$%^&*
  if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(password)) {
    return 'Password can only contain letters, numbers, and !@#$%^&*.';
  }
  return ''; // No error
};

// --- Component ---

export default function RegisterForm({ onRegister, onSwitchToLogin, error: apiError }) { // Renamed prop 'error' to 'apiError'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false); // State to track overall form validity

  // --- Validation Effect ---
  // Re-validate whenever formData changes
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      newErrors.firstName = validateAlphaNumeric(formData.firstName, 2, 10);
      newErrors.lastName = validateAlphaNumeric(formData.lastName, 2, 15);
      newErrors.email = validateEmail(formData.email);
      newErrors.username = validateAlphaNumeric(formData.username, 2, 10);
      newErrors.password = validatePassword(formData.password);

      setErrors(newErrors);

      // Check if all fields are filled and there are no errors
      const allFieldsFilled = Object.values(formData).every(value => value.trim() !== ''); // Check trimmed value
      const noErrorsPresent = Object.values(newErrors).every(error => error === '');
      setIsFormValid(allFieldsFilled && noErrorsPresent);
    };

    validateForm(); // Run validation on initial load and changes
  }, [formData]); // Dependency array includes formData

  // --- Handlers ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    // Validation now happens via the useEffect hook
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Double-check validity before submitting (though button should be disabled)
    if (!isFormValid) {
      console.warn("Attempted to submit invalid form.");
      // Optionally trigger validation again to show all errors if needed
      return;
    }

    setIsLoading(true);
    // Clear previous API errors when attempting a new submission
    // Note: We keep the individual field errors from useState until corrected
    // The 'apiError' prop handles errors from the actual API call
    await onRegister(formData); // Pass validated data
    setIsLoading(false);
  };

  // --- JSX ---

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate> {/* Add noValidate to disable browser default validation */}
      <h2>Register</h2>
      {/* Display API error from the parent (e.g., username taken) */}
      {apiError && <p className="error-message api-error">{apiError}</p>}

      {/* First Name */}
      <div className="form-group">
        <label htmlFor="reg-firstName">First Name</label>
        <input
          type="text"
          id="reg-firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          aria-invalid={!!errors.firstName} // For accessibility
          aria-describedby="firstName-error"
        />
        {errors.firstName && <p id="firstName-error" className="error-message">{errors.firstName}</p>}
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label htmlFor="reg-lastName">Last Name</label>
        <input
          type="text"
          id="reg-lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          aria-invalid={!!errors.lastName}
          aria-describedby="lastName-error"
        />
        {errors.lastName && <p id="lastName-error" className="error-message">{errors.lastName}</p>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="reg-email">Email</label>
        <input
          type="email"
          id="reg-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
        />
        {errors.email && <p id="email-error" className="error-message">{errors.email}</p>}
      </div>

      {/* Username */}
      <div className="form-group">
        <label htmlFor="reg-username">Username</label>
        <input
          type="text"
          id="reg-username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
          aria-invalid={!!errors.username}
          aria-describedby="username-error"
        />
        {errors.username && <p id="username-error" className="error-message">{errors.username}</p>}
      </div>

      {/* Password */}
      <div className="form-group">
        <label htmlFor="reg-password">Password</label>
        <input
          type="password"
          id="reg-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          aria-describedby="password-error"
        />
        {errors.password && <p id="password-error" className="error-message">{errors.password}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isFormValid} // Disable if loading or form is invalid
        className="auth-button"
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>

      {/* Switch to Login */}
      <p className="switch-form">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="link-button">
          Login here
        </button>
      </p>
    </form>
  );
}

