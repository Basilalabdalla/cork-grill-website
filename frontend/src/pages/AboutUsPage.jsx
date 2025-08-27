import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">About Cork Grill</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Location</h2>
        <p className="mb-4">You can find us at: <span className="font-semibold">T23 DX52, Cork, Ireland</span></p>
        
        {/* --- Google Maps Embed --- */}
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          {/* This is a standard Google Maps embed iframe. It's the best way to do this. */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2462.373210350284!2d-8.4611599!3d51.9008987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4844900e3a512c8b%3A0x835154362d888361!2sT23%20DX52!5e0!3m2!1sen!2sie!4v1692997234567!5m2!1sen!2sie" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Our Reviews</h2>
        <p>Google Reviews integration coming soon!</p>
        {/* We will build the component to fetch and display reviews here later */}
      </div>
    </div>
  );
};

export default AboutUsPage;