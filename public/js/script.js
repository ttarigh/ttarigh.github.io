// Improved screen check function
function checkScreenWidth() {
  if (window.innerWidth <= 767 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return "mindex.html";
  } else {
    return "index.html";
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Handle project row clicks for expanding content
  const projectRows = document.querySelectorAll('.project-row');
  const imageStage = document.querySelector('.image-stage');
  const isMobile = window.innerWidth <= 768;
  let isAnyProjectExpanded = false;
  
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
          if (isAnyProjectExpanded) return; // Skip if any project is expanded
          
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

  // Create floating preview element
  const floatingPreview = document.createElement('div');
  floatingPreview.className = 'floating-preview';
  const previewImg = document.createElement('img');
  floatingPreview.appendChild(previewImg);
  document.body.appendChild(floatingPreview);
  
  projectRows.forEach(row => {
    // Get the image path from data attribute or first image in the project
    const imagePath = row.getAttribute('data-preview-image');
    
    if (imagePath) {
      // Mouse enter event
      row.addEventListener('mouseenter', function(e) {
        previewImg.src = imagePath;
        floatingPreview.style.display = 'block';
        updatePreviewPosition(e);
      });
      
      // Mouse move event
      row.addEventListener('mousemove', updatePreviewPosition);
      
      // Mouse leave event
      row.addEventListener('mouseleave', function() {
        floatingPreview.style.display = 'none';
      });
    }
  });
  
  // Update preview position
  function updatePreviewPosition(e) {
    // Position in center of screen instead of following cursor exactly
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    floatingPreview.style.left = (windowWidth / 2) + 'px';
    floatingPreview.style.top = (windowHeight / 2) + 'px';
  }
  
  // Gallery navigation for work projects
  setupGalleryNavigation();
});

// Function to set up gallery navigation for work projects
function setupGalleryNavigation() {
  // Store image data for each gallery
  const galleryData = {};
  
  // Find all galleries on the page
  const galleries = document.querySelectorAll('.picture-gallery');
  
  galleries.forEach((gallery, galleryIndex) => {
    const projectId = gallery.closest('.work-project').id;
    const navButton = gallery.querySelector('.gallery-nav');
    const mainImageContainer = gallery.querySelector('.gallery-main');
    const mainImage = mainImageContainer.querySelector('img');
    
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
        galleryData[projectId].images = ['wordtocode.gif', 'handspew.gif'];
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
      
      // Move to next image
      data.currentIndex = (data.currentIndex + 1) % data.images.length;
      
      // Update the image
      const newSrc = `images/${data.category}/${data.images[data.currentIndex]}`;
      mainImage.src = newSrc;
    });
  });
} 