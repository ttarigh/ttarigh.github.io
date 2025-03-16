// Mobile-specific JavaScript for work projects

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });
  }
  
  // Redirect to appropriate version based on device
  function checkDeviceAndRedirect() {
    // Only redirect if we're not already on the correct version
    const currentPath = window.location.pathname;
    const isMobilePage = currentPath.includes('m') && !currentPath.includes('images');
    
    if (window.innerWidth <= 767 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // On mobile device
      if (!isMobilePage && !currentPath.includes('mindex.html')) {
        // Convert current path to mobile version
        let newPath = currentPath.replace('.html', '');
        if (newPath === '/' || newPath === '') {
          window.location.href = 'mindex.html';
        } else {
          newPath = 'm' + newPath.substring(newPath.lastIndexOf('/') + 1) + '.html';
          window.location.href = newPath;
        }
      }
    } else {
      // On desktop
      if (isMobilePage) {
        // Convert to desktop version
        let newPath = currentPath.replace('m', '');
        window.location.href = newPath;
      }
    }
  }
  
  // Check device on initial load
  // Uncomment this if you want automatic redirection
  // checkDeviceAndRedirect();
});

// Function to set up gallery navigation for work projects
function setupGalleryNavigation() {
  // Find all galleries on the page
  const galleries = document.querySelectorAll('.picture-gallery');
  
  galleries.forEach(gallery => {
    const navButton = gallery.querySelector('.gallery-nav');
    const mainImage = gallery.querySelector('.gallery-main img');
    
    // Skip if no navigation button or main image
    if (!navButton || !mainImage) return;
    
    // Get images data from data attribute
    const imagesData = gallery.getAttribute('data-images');
    if (!imagesData) return;
    
    try {
      const images = JSON.parse(imagesData);
      if (!images || images.length <= 1) return;
      
      let currentIndex = 0;
      
      // Add click event to navigation button
      navButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Move to next image
        currentIndex = (currentIndex + 1) % images.length;
        
        // Update the image with fade effect
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
          mainImage.src = `images/work/${images[currentIndex]}`;
          mainImage.style.opacity = '1';
        }, 200);
      });
      
      // Add touch swipe for gallery navigation
      let touchStartX = 0;
      let touchEndX = 0;
      
      gallery.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, false);
      
      gallery.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, false);
      
      function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
          // Swipe left - next image
          currentIndex = (currentIndex + 1) % images.length;
          updateImage();
        } else if (touchEndX > touchStartX + swipeThreshold) {
          // Swipe right - previous image
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          updateImage();
        }
      }
      
      function updateImage() {
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
          mainImage.src = `images/work/${images[currentIndex]}`;
          mainImage.style.opacity = '1';
        }, 200);
      }
      
      // Add fade transition to main image
      mainImage.style.transition = 'opacity 0.2s ease-in-out';
      
    } catch (e) {
      console.error('Error parsing images data:', e);
    }
  });
}

// Add smooth scrolling for anchor links
document.addEventListener('click', function(e) {
  const target = e.target;
  
  if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
    e.preventDefault();
    
    const targetId = target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  }
}); 