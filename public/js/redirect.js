// Simple redirect script for mobile/desktop detection
(function() {
  // Check if we should redirect based on device
  function shouldRedirect() {
    const currentPath = window.location.pathname;
    const isMobilePage = currentPath.includes('m') && !currentPath.includes('images');
    
    if (window.innerWidth <= 767 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // On mobile device
      return !isMobilePage && !currentPath.includes('mindex.html');
    } else {
      // On desktop
      return isMobilePage;
    }
  }
  
  // Redirect to appropriate version
  function redirectToCorrectVersion() {
    const currentPath = window.location.pathname;
    const isMobilePage = currentPath.includes('m') && !currentPath.includes('images');
    
    if (window.innerWidth <= 767 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // On mobile device - redirect to mobile version
      let newPath = currentPath.replace('.html', '');
      if (newPath === '/' || newPath === '') {
        window.location.href = 'mindex.html';
      } else {
        newPath = 'm' + newPath.substring(newPath.lastIndexOf('/') + 1) + '.html';
        window.location.href = newPath;
      }
    } else {
      // On desktop - redirect to desktop version
      let newPath = currentPath.replace('m', '');
      window.location.href = newPath;
    }
  }
  
  // Check if we need to redirect
  if (shouldRedirect()) {
    redirectToCorrectVersion();
  }
})(); 