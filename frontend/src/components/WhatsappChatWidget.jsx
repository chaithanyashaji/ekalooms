import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaPaperPlane, FaTimes, FaCommentDots } from 'react-icons/fa';

const WhatsAppChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Your WhatsApp business number (replace with actual number)
  const WHATSAPP_NUMBER = '+919113054569';

  // Check screen size for responsive design
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Open WhatsApp chat
  const openWhatsAppChat = () => {
    const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
    const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
    window.open(`${baseUrl}${encodedMessage}`, '_blank');
  };

  // Predefined quick messages
  const quickMessages = [
    'Need product help',
    'Order inquiry',
    'Shipping information',
    'Return policy',
    'Custom request'
  ];

  return (
    <div className="fixed bottom-40 right-4 z-20 w-full max-w-xs mx-auto">
      {/* WhatsApp Chat Bubble */}
      {!isOpen && (
        <button 
          aria-label="Open WhatsApp Chat"
          onClick={() => setIsOpen(true)}
          className="bg-[#D3756B] text-white p-3 sm:p-4 rounded-full shadow-xl 
          hover:bg-[#A75D5D] transition-all duration-300 ease-in-out 
          flex items-center justify-center ml-auto"
        >
          <FaWhatsapp className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 w-[95vw] max-w-md mx-auto 
          bg-white rounded-xl shadow-2xl border border-gray-200 
          transform transition-all duration-300 ease-in-out 
          max-h-[90vh] flex flex-col z-50"
        >
          {/* Chat Header */}
          <div className="bg-[#A75D5D] text-white p-3 sm:p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaWhatsapp className="w-4 h-4 text-white" />
              <h3 className="font-semibold text-sm sm:text-base">Chat with Us</h3>
            </div>
            <button 
              aria-label="Close Chat"
              onClick={() => setIsOpen(false)}
              className="hover:bg-[#F0997D] p-1 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Content Container */}
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* Quick Message Buttons */}
            <div className="p-3 overflow-x-auto whitespace-nowrap bg-gray-50 border-b">
              {quickMessages.map((msg, index) => (
                <button 
                  key={index}
                  onClick={() => setMessage(msg)}
                  className="bg-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full mr-2 mb-2 
                  border hover:bg-gray-100 transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-3 flex-grow flex flex-col justify-end">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-2 border rounded-md focus:outline-none 
                focus:ring-2 focus:ring-[#D3756B] text-sm sm:text-base
                resize-none min-h-[100px]"
                rows={4}
                maxLength={500}
              />

              {/* Character Count */}
              <div className="text-xs text-gray-500 text-right mt-1">
                {message.length}/500
              </div>

              {/* Send Button */}
              <button 
                onClick={openWhatsAppChat}
                disabled={!message.trim()}
                className="mt-2 w-full bg-[#D3756B] text-white py-2 rounded-md 
                flex items-center justify-center gap-2 
                hover:bg-[#F0997D] transition-colors 
                disabled:opacity-50 disabled:cursor-not-allowed
                text-sm sm:text-base"
              >
                <FaPaperPlane className="w-4 h-4" /> Send on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppChatWidget;