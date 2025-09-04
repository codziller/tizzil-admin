import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  const [mountElement, setMountElement] = useState(null);

  useEffect(() => {
    // Create or get the portal container
    let portalContainer = document.getElementById("modal-portal");
    if (!portalContainer) {
      portalContainer = document.createElement("div");
      portalContainer.id = "modal-portal";
      portalContainer.style.position = "relative";
      portalContainer.style.zIndex = "99999";
      document.body.appendChild(portalContainer);
    }
    setMountElement(portalContainer);

    return () => {
      // Cleanup: remove portal container if it's empty when component unmounts
      if (portalContainer && portalContainer.children.length === 0) {
        document.body.removeChild(portalContainer);
      }
    };
  }, []);

  if (!mountElement) return null;

  return createPortal(children, mountElement);
};

export default Portal;
