// ===== UTILITY FUNCTIONS =====

// Debounce function to limit execution of resize events
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Check if device is mobile
function isMobileDevice() {
  return window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ===== MAIN FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
  // Handle project row clicks for expanding content
  const projectRows = document.querySelectorAll('.project-row');
  const imageStage = document.querySelector('.image-stage');
  let isMobile = isMobileDevice();
  let isAnyProjectExpanded = false;
  
  // Create floating preview element
  const floatingPreview = document.createElement('div');
  floatingPreview.className = 'floating-preview';
  const previewImg = document.createElement('img');
  floatingPreview.appendChild(previewImg);
  document.body.appendChild(floatingPreview);
  
  // Handle window resize events
  const handleResize = debounce(function() {
    isMobile = isMobileDevice();
    
    // Hide floating preview on mobile
    if (isMobile && floatingPreview.style.display === 'block') {
      floatingPreview.style.display = 'none';
    }
    
    // Adjust gallery image sizes if needed
    const galleryImages = document.querySelectorAll('.gallery-main img');
    galleryImages.forEach(img => {
      if (img.complete) {
        img.style.height = 'auto';
      }
    });
    
    // Check for multi-image galleries and ensure they're displayed correctly
    setupMultiImageGalleries();
  }, 250);
  
  window.addEventListener('resize', handleResize);
  
  // Function to expand a project row
  function expandProjectRow(row) {
    const projectId = row.getAttribute('data-project-id');
    const detailsRow = document.getElementById(projectId + '-details');
    
    if (!detailsRow) {
      console.error('Could not find details row for project:', projectId);
      return;
    }
    
    // Close all open detail rows first
    document.querySelectorAll('.project-details').forEach(details => {
      details.style.display = 'none';
    });
    
    document.querySelectorAll('.project-row').forEach(r => {
      r.classList.remove('active-row');
    });
    
    // Open this row
    detailsRow.style.display = 'table-row';
    row.classList.add('active-row');
    isAnyProjectExpanded = true;
    
    // Hide any visible preview image
    if (imageStage) {
      const previewImage = imageStage.querySelector('img');
      if (previewImage) {
        previewImage.classList.remove('visible');
      }
    }
    
    // Scroll to make sure the expanded content is visible
    setTimeout(() => {
      detailsRow.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }, 100);
  }
  
  if (projectRows.length > 0) {
    // Only set up image preview for non-mobile devices
    if (!isMobile && imageStage) {
      // Create a single image element for the stage
      const previewImage = document.createElement('img');
      imageStage.appendChild(previewImage);
      
      // Handle hover events for image preview
      projectRows.forEach(row => {
        // Show image on hover (only if no project is expanded)
        row.addEventListener('mouseenter', function() {
          if (isAnyProjectExpanded || isMobile) return;
          
          const imagePath = this.getAttribute('data-preview-image');
          if (imagePath) {
            previewImage.src = imagePath;
            previewImage.classList.add('visible');
          }
        });
        
        // Track mouse movement to follow cursor
        row.addEventListener('mousemove', function(e) {
          if (isAnyProjectExpanded || isMobile) return;
          
          if (previewImage.classList.contains('visible')) {
            previewImage.style.left = e.clientX + 'px';
            previewImage.style.top = e.clientY + 'px';
          }
        });
        
        // Hide image when mouse leaves
        row.addEventListener('mouseleave', function() {
          previewImage.classList.remove('visible');
        });
      });
    }
    
    // Auto-expand starred projects on mobile
    if (isMobile) {
      // Find all projects with a star in their title and expand them
      let starredProjects = [];
      projectRows.forEach(row => {
        const projectTitle = row.querySelector('.col-project').textContent;
        if (projectTitle.includes('☆')) {
          starredProjects.push(row);
        }
      });
      
      // If we found any starred projects, expand them
      if (starredProjects.length > 0) {
        // First, close all projects
        document.querySelectorAll('.project-details').forEach(details => {
          details.style.display = 'none';
        });
        
        document.querySelectorAll('.project-row').forEach(r => {
          r.classList.remove('active-row');
        });
        
        // Then expand all starred projects
        starredProjects.forEach(row => {
          const projectId = row.getAttribute('data-project-id');
          const detailsRow = document.getElementById(projectId + '-details');
          
          if (detailsRow) {
            detailsRow.style.display = 'table-row';
            row.classList.add('active-row');
            isAnyProjectExpanded = true;
          }
        });
        
        // Scroll to the first starred project
        if (starredProjects.length > 0) {
          setTimeout(() => {
            starredProjects[0].scrollIntoView({behavior: 'smooth', block: 'start'});
          }, 100);
        }
      }
    }
    
    // Handle click for expanding content (for all devices)
    projectRows.forEach(row => {
      row.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project-id');
        const detailsRow = document.getElementById(projectId + '-details');
        
        if (!detailsRow) {
          console.error('Could not find details row for project:', projectId);
          return;
        }
        
        // Check if this row is already active
        const isActive = this.classList.contains('active-row');
        
        // Close all open detail rows first
        document.querySelectorAll('.project-details').forEach(details => {
          details.style.display = 'none';
        });
        
        document.querySelectorAll('.project-row').forEach(r => {
          r.classList.remove('active-row');
        });
        
        // If the clicked row wasn't active before, open it
        if (!isActive) {
          detailsRow.style.display = 'table-row';
          this.classList.add('active-row');
          isAnyProjectExpanded = true;
          
          // Hide any visible preview image
          if (imageStage) {
            const previewImage = imageStage.querySelector('img');
            if (previewImage) {
              previewImage.classList.remove('visible');
            }
          }
          
          // Scroll to make sure the expanded content is visible
          setTimeout(() => {
            detailsRow.scrollIntoView({behavior: 'smooth', block: 'nearest'});
          }, 100);
        } else {
          isAnyProjectExpanded = false;
        }
      });
    });
  }
  
  // ===== FLOATING PREVIEW FUNCTIONALITY =====
  
  // Update floating preview position
  function updatePreviewPosition(e) {
    if (isMobile) return;
    
    const preview = document.querySelector('.floating-preview');
    if (preview && preview.style.display === 'block') {
      const rect = preview.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      // Adjust position to keep preview within viewport
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      
      const adjustedX = Math.min(Math.max(x, rect.width / 2), maxX + rect.width / 2);
      const adjustedY = Math.min(Math.max(y, rect.height / 2), maxY + rect.height / 2);
      
      preview.style.left = adjustedX + 'px';
      preview.style.top = adjustedY + 'px';
    }
  }
  
  // Add mouse move listener for floating preview
  document.addEventListener('mousemove', updatePreviewPosition);
  
  // ===== GALLERY FUNCTIONALITY =====
  
  // Setup multi-image galleries
  function setupMultiImageGalleries() {
    const galleries = document.querySelectorAll('.picture-gallery[data-images]');
    
    galleries.forEach(gallery => {
      const images = gallery.getAttribute('data-images').split(',');
      const mainImage = gallery.querySelector('.gallery-main img');
      const navContainer = gallery.querySelector('.gallery-nav');
      
      if (images.length > 1 && mainImage && navContainer) {
        // Create navigation buttons
        navContainer.innerHTML = '';
        images.forEach((img, index) => {
          const button = document.createElement('button');
          button.textContent = index + 1;
          button.className = index === 0 ? 'active' : '';
          
          button.addEventListener('click', () => {
            // Update main image
            mainImage.src = img.trim();
            
            // Update active button
            navContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
          });
          
          navContainer.appendChild(button);
        });
      }
    });
  }
  
  // Initialize galleries
  setupMultiImageGalleries();
  
  // ===== LAZY LOADING =====
  
  // Lazy load images
  const lazyLoadImages = function() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  };
  
  // Initialize lazy loading if supported
  if ('IntersectionObserver' in window) {
    lazyLoadImages();
  }
  
  // ===== TOUCH SUPPORT =====
  
  // Add touch support for galleries
  function addTouchSupport() {
    const galleries = document.querySelectorAll('.picture-gallery[data-images]');
    
    galleries.forEach(gallery => {
      let startX = 0;
      let currentIndex = 0;
      const images = gallery.getAttribute('data-images').split(',');
      const mainImage = gallery.querySelector('.gallery-main img');
      const navButtons = gallery.querySelectorAll('.gallery-nav button');
      
      if (images.length <= 1) return;
      
      function handleSwipe(gallery) {
        const rect = gallery.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        
        if (startX < centerX - 50 && currentIndex < images.length - 1) {
          // Swipe left - next image
          currentIndex++;
        } else if (startX > centerX + 50 && currentIndex > 0) {
          // Swipe right - previous image
          currentIndex--;
        }
        
        // Update image and button
        if (mainImage) {
          mainImage.src = images[currentIndex].trim();
        }
        
        navButtons.forEach((btn, index) => {
          btn.classList.toggle('active', index === currentIndex);
        });
      }
      
      gallery.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      });
      
      gallery.addEventListener('touchend', (e) => {
        handleSwipe(gallery);
      });
    });
  }
  
  // Initialize touch support
  addTouchSupport();
  
  // ===== GALLERY NAVIGATION =====
  
  // Setup gallery navigation
  function setupGalleryNavigation() {
    const galleries = document.querySelectorAll('.picture-gallery[data-images]');
    
    galleries.forEach(gallery => {
      const images = gallery.getAttribute('data-images').split(',');
      const mainImage = gallery.querySelector('.gallery-main img');
      const navButtons = gallery.querySelectorAll('.gallery-nav button');
      
      if (images.length > 1 && mainImage && navButtons.length > 0) {
        navButtons.forEach((button, index) => {
          button.addEventListener('click', () => {
            mainImage.src = images[index].trim();
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
          });
        });
      }
    });
  }
  
  // Initialize gallery navigation
  setupGalleryNavigation();
}); 