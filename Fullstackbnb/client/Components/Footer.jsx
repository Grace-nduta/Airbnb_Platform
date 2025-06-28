import React from 'react';
function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-sm text-gray-600 py-6 mt-10">
      &copy; {new Date().getFullYear()} StayAway — All rights reserved.
    </footer>
    
  );
}

export default Footer;