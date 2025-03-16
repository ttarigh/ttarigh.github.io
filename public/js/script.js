// Improved screen check function
function checkScreenWidth() {
  if (window.innerWidth <= 767 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return "mindex.html";
  } else {
    return "index.html";
  }
}

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
      // Ensure images are loaded properly after resize
      if (img.complete) {
        img.style.height = 'auto'; // Reset height to maintain aspect ratio
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
          if (isAnyProjectExpanded || isMobile) return; // Skip if any project is expanded or on mobile
          
          const imagePath = this.getAttribute('data-preview-image');
          if (imagePath) {
            previewImage.src = imagePath;
            previewImage.classList.add('visible');
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
          // If we're closing the active row, update the flag
          isAnyProjectExpanded = false;
        }
      });
    });
  }
  
  projectRows.forEach(row => {
    // Get the image path from data attribute or first image in the project
    const imagePath = row.getAttribute('data-preview-image');
    
    if (imagePath && !isMobile) {
      // Mouse enter event
      row.addEventListener('mouseenter', function(e) {
        if (isAnyProjectExpanded) return; // Don't show preview if a project is expanded
        
        previewImg.src = imagePath;
        floatingPreview.style.display = 'block';
        updatePreviewPosition(e);
      });
      
      // Mouse move event
      row.addEventListener('mousemove', function(e) {
        if (!isMobile) updatePreviewPosition(e);
      });
      
      // Mouse leave event
      row.addEventListener('mouseleave', function() {
        floatingPreview.style.display = 'none';
      });
    }
  });
  
  // Update preview position - improved for better positioning
  function updatePreviewPosition(e) {
    if (isMobile) {
      floatingPreview.style.display = 'none';
      return;
    }
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // For larger screens, follow cursor with offset
    if (windowWidth > 1024) {
      // Position near cursor but with offset to avoid covering content
      const offsetX = 20;
      const offsetY = 20;
      let posX = e.clientX + offsetX;
      let posY = e.clientY + offsetY;
      
      // Make sure preview stays within viewport
      const previewRect = floatingPreview.getBoundingClientRect();
      const previewWidth = previewRect.width || 300; // Fallback if not yet rendered
      const previewHeight = previewRect.height || 200;
      
      if (posX + previewWidth > windowWidth - 20) {
        posX = e.clientX - previewWidth - offsetX;
      }
      
      if (posY + previewHeight > windowHeight - 20) {
        posY = e.clientY - previewHeight - offsetY;
      }
      
      floatingPreview.style.left = posX + 'px';
      floatingPreview.style.top = posY + 'px';
      floatingPreview.style.transform = 'none';
    } else {
      // For medium screens, center in viewport
      floatingPreview.style.left = (windowWidth / 2) + 'px';
      floatingPreview.style.top = (windowHeight / 2) + 'px';
      floatingPreview.style.transform = 'translate(-50%, -50%)';
    }
  }
  
  // Function to set up multi-image galleries
  function setupMultiImageGalleries() {
    const galleries = document.querySelectorAll('.picture-gallery[data-images]');
    
    galleries.forEach(gallery => {
      const imagesData = gallery.getAttribute('data-images');
      if (!imagesData) return;
      
      try {
        const images = JSON.parse(imagesData);
        if (images.length <= 1) return;
        
        // If we have multiple images, make sure we have the right structure
        if (gallery.querySelectorAll('.gallery-main').length < 2) {
          const projectId = gallery.closest('.work-project').id;
          const category = 'work'; // Default category
          
          // Get the first image to extract the category
          const firstImage = gallery.querySelector('.gallery-main img');
          if (firstImage) {
            const pathParts = firstImage.src.split('/');
            if (pathParts.length >= 2) {
              const possibleCategory = pathParts[pathParts.length - 2];
              if (possibleCategory) {
                category = possibleCategory;
              }
            }
          }
          
          // Add additional image containers for side-by-side display
          for (let i = 1; i < Math.min(images.length, 2); i++) {
            const newContainer = document.createElement('div');
            newContainer.className = 'gallery-main';
            
            const newImage = document.createElement('img');
            newImage.src = `images/${category}/${images[i]}`;
            newImage.alt = `Additional image for ${projectId}`;
            newImage.loading = "lazy";
            
            newContainer.appendChild(newImage);
            gallery.appendChild(newContainer);
          }
        }
      } catch (e) {
        console.error('Error parsing images data:', e);
      }
    });
  }
  
  // Lazy load images for better performance
  const lazyLoadImages = function() {
    const images = document.querySelectorAll('.work-images img');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
            
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => {
        // Only observe images with data-src attribute
        if (img.getAttribute('data-src')) {
          imageObserver.observe(img);
        }
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
      });
    }
  };
  
  // Call lazy load function
  lazyLoadImages();
  
  // Set up multi-image galleries
  setupMultiImageGalleries();
  
  // Gallery navigation for work projects
  setupGalleryNavigation();
  
  // Add touch support for gallery navigation
  addTouchSupport();
});

// Function to add touch support for gallery navigation
function addTouchSupport() {
  const galleries = document.querySelectorAll('.picture-gallery');
  
  galleries.forEach(gallery => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    gallery.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    gallery.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe(gallery);
    }, false);
    
    function handleSwipe(gallery) {
      const swipeThreshold = 50;
      const navButton = gallery.querySelector('.gallery-nav');
      
      // If swiped left to right (and far enough)
      if (touchEndX - touchStartX > swipeThreshold && navButton) {
        // Trigger click on navigation button
        navButton.click();
      }
      // For right to left swipe, we could add previous image functionality
      else if (touchStartX - touchEndX > swipeThreshold && navButton) {
        // Optional: Add previous image functionality
        // For now, just trigger next image (same as button click)
        navButton.click();
      }
    }
  });
}

// Function to set up gallery navigation for work projects
function setupGalleryNavigation() {
  // Store image data for each gallery
  const galleryData = {};
  
  // Find all galleries on the page
  const galleries = document.querySelectorAll('.picture-gallery');
  
  galleries.forEach((gallery, galleryIndex) => {
    const projectId = gallery.closest('.work-project').id;
    const mainImageContainer = gallery.querySelector('.gallery-main');
    const mainImage = mainImageContainer.querySelector('img');
    
    // Create navigation button if it doesn't exist and there are multiple images
    let navButton = gallery.querySelector('.gallery-nav');
    if (!navButton && (gallery.getAttribute('data-images') || projectId === 'gemini-2.0-experiments-@-google-creative-lab')) {
      navButton = document.createElement('div');
      navButton.className = 'gallery-nav';
      navButton.innerHTML = '→';
      gallery.appendChild(navButton);
    }
    
    // Skip if no navigation button (only one image)
    if (!navButton) return;
    
    // Initialize gallery data
    galleryData[projectId] = {
      currentIndex: 0,
      images: [],
      category: 'work' // Default category
    };
    
    // Extract project title from alt attribute or parent element
    const projectTitle = mainImage.alt || gallery.closest('.work-project').querySelector('.work-title').textContent;
    
    // Get the current image src and extract the filename
    const currentSrc = mainImage.src;
    const srcParts = currentSrc.split('/');
    const filename = srcParts[srcParts.length - 1];
    
    // Extract category from path
    const pathParts = currentSrc.split('/');
    if (pathParts.length >= 2) {
      galleryData[projectId].category = pathParts[pathParts.length - 2];
    }
    
    // Get images from data attribute if available
    const imagesData = gallery.getAttribute('data-images');
    if (imagesData) {
      try {
        galleryData[projectId].images = JSON.parse(imagesData);
      } catch (e) {
        console.error('Error parsing images data:', e);
        galleryData[projectId].images.push(filename);
      }
    } else {
      // Fallback for Gemini 2.0 Experiments project if data attribute is not available
      if (projectId === 'gemini-2.0-experiments-@-google-creative-lab') {
        galleryData[projectId].images = ['gemini-experiments.jpg', 'wordtocode.gif', 'handspew.gif'];
      } else {
        // For other projects, just add the current image
        galleryData[projectId].images.push(filename);
      }
    }
    
    // Add click event to navigation button
    navButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const data = galleryData[projectId];
      if (!data || data.images.length <= 1) return;
      
      // For galleries with side-by-side images, we need to update both images
      const allImageContainers = gallery.querySelectorAll('.gallery-main');
      const category = data.category;
      
      if (allImageContainers.length >= 2) {
        // If we have multiple containers, update them with consecutive images
        data.currentIndex = (data.currentIndex + 1) % (data.images.length - 1);
        
        // Update the images
        allImageContainers.forEach((container, idx) => {
          if (idx < 2) { // Only update the first two containers
            const imageIndex = (data.currentIndex + idx) % data.images.length;
            const newSrc = `images/${category}/${data.images[imageIndex]}`;
            const img = container.querySelector('img');
            
            if (img) {
              // Create a new image to preload
              const tempImg = new Image();
              tempImg.onload = function() {
                img.src = newSrc;
              };
              tempImg.src = newSrc;
              
              // If image doesn't load within 3 seconds, show it anyway
              setTimeout(() => {
                if (img.src !== newSrc) {
                  img.src = newSrc;
                }
              }, 3000);
            }
          }
        });
      } else {
        // Traditional single image update
        data.currentIndex = (data.currentIndex + 1) % data.images.length;
        
        // Update the image
        const newSrc = `images/${category}/${data.images[data.currentIndex]}`;
        
        // Create a new image to preload
        const tempImg = new Image();
        tempImg.onload = function() {
          mainImage.src = newSrc;
        };
        tempImg.src = newSrc;
        
        // If image doesn't load within 3 seconds, show it anyway
        setTimeout(() => {
          if (mainImage.src !== newSrc) {
            mainImage.src = newSrc;
          }
        }, 3000);
      }
    });
  });
} 