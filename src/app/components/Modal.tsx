'use client';

import { useEffect, useState } from 'react';

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-3xl">
            <button className="text-gray-500 hover:text-black float-right text-2xl" onClick={closeModal}>
              &times;
            </button>
            <iframe 
              src="https://docs.google.com/document/d/1DW9pFY1ygwIkNSLXu7PC2BnaRaqgWWYL/preview" 
              className="w-full h-96 border-none"
              title="Google Document"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;