import React from 'react';
    import { Helmet } from 'react-helmet-async';
    
    function GoogleAds() {
      return (
        <div>
         <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="YOUR_AD_CLIENT_ID"
            data-ad-slot="YOUR_AD_SLOT_ID"
            data-ad-format="auto"
          ></ins>
        </div>
      );
    }
    
export default GoogleAds;