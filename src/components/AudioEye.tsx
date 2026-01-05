import { useEffect } from 'react';

const AudioEye = () => {
  useEffect(() => {
    // Define the AudioEye initialization function
    const initAudioEye = () => {
      // Set the site hash
      (window as any).__AudioEyeSiteHash = "5ee7375b9d006e38586be01e7511078b";

      // Create and inject the script
      const script = document.createElement("script");
      script.src = "https://wsmcdn.audioeye.com/aem.js";
      script.type = "text/javascript";
      script.setAttribute("async", "");
      document.getElementsByTagName("body")[0].appendChild(script);
    };

    // Check if document is ready
    if (document.readyState !== "complete") {
      if (window.addEventListener) {
        window.addEventListener("load", initAudioEye);
      } else if ((window as any).attachEvent) {
        (window as any).attachEvent("onload", initAudioEye);
      }
    } else {
      initAudioEye();
    }

    // Cleanup function
    return () => {
      // Remove event listener if it was added
      if (document.readyState !== "complete") {
        window.removeEventListener("load", initAudioEye);
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default AudioEye;
