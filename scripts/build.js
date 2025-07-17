const fs = require('fs');
const path = require('path');

// Function to convert rich text to HTML string
function richTextToHtml(richText) {
  if (!richText) return '';
  
  // Handle both string and rich-text format
  if (typeof richText === 'string') {
    return richText.replace(/\n/g, '</p>\n<p>');
  }
  
  // If it's rich text format from Tina, convert it
  if (richText.children) {
    return richText.children.map(child => {
      if (child.type === 'p') {
        const text = child.children.map(c => c.text || '').join('');
        return `<p>${text}</p>`;
      }
      return '';
    }).join('\n');
  }
  
  return richText;
}

// Function to generate HTML for a single art project
function generateProjectHTML(project) {
  const projectId = project.id.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  const detailsId = `${projectId}-details`;
  
  // Format body content
  let bodyContent = '';
  if (project.body) {
    const htmlContent = richTextToHtml(project.body);
    if (htmlContent.includes('<p>') || htmlContent.includes('</p>')) {
      bodyContent = htmlContent;
    } else {
      // Split by newlines and wrap in paragraphs
      const paragraphs = htmlContent.split('\n\n').filter(p => p.trim());
      bodyContent = paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n');
    }
  }
  
  // Generate link HTML
  let linkHTML = '';
  if (project.link && project.linkText) {
    linkHTML = `<a href="${project.link}" class="details-link" target="_blank">${project.linkText}</a>`;
  }
  
  // Generate images HTML
  let imagesHTML = '';
  if (project.images && project.images.length > 0) {
    imagesHTML = project.images.map(img => {
      const src = typeof img === 'string' ? img : (img.src || img);
      const alt = typeof img === 'object' && img.alt ? img.alt : project.title;
      return `<img src="${src}" alt="${alt}" />`;
    }).join('\n          ');
  } else if (project.previewImage) {
    imagesHTML = `<img src="${project.previewImage}" alt="${project.title}" />`;
  }

  return `
<tr class="project-row" data-project-id="${projectId}" 
    data-preview-image="${project.previewImage}">
  <td class="col-project">${project.title}</td>
  <td class="col-category">${project.category}</td>
  <td class="col-year">${project.year}</td>
</tr>
<tr class="project-details" id="${detailsId}">
  <td colspan="3">
    <div class="details-container">
      <div class="details-grid">
        <div class="details-info">
          <div class="details-description">${project.description}</div>
          ${bodyContent ? `<div class="details-body">${bodyContent}</div>` : ''}
          ${linkHTML}
        </div>
        <div class="details-images">
          ${imagesHTML}
        </div>
      </div>
    </div>
  </td>
</tr>`;
}

// Function to generate the complete art.html file
function generateArtHTML(artData) {
  const projectsHTML = artData.artProjects.map(generateProjectHTML).join('\n            ');
  
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Art | TINA TARIGHIAN</title>
    <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.webp" />
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.webp" />
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.webp" />
    <link rel="manifest" href="img/site.webmanifest" />
    <link rel="stylesheet" href="css/main.css" />
  </head>
  <body>
    <div class="container">
      <header class="site-header">
        <h1><a href="index.html" class="home-link">Tina Tarighian:</a> <a href="art.html" class="page-highlight">Art</a> | <a href="work.html" class="page-link">Work</a></h1>
      </header>
      
      <!-- Image preview stage -->
      <div class="image-stage"></div>
      
      <div class="table-wrapper">
        <table class="projects-table">
          <tbody>
            ${projectsHTML}
          </tbody>
        </table>
      </div>
    </div>
    <script src="js/main.js"></script>
  </body>
</html>`;
}

// Main build function
function buildSite() {
  try {
    // Read the art projects data
    const artDataPath = path.join(__dirname, '../content/art.json');
    
    if (!fs.existsSync(artDataPath)) {
      console.log('Art data file not found, skipping build');
      return;
    }
    
    const artData = JSON.parse(fs.readFileSync(artDataPath, 'utf8'));
    
    // Generate and write the art.html file
    const artHTML = generateArtHTML(artData);
    const artOutputPath = path.join(__dirname, '../art.html');
    fs.writeFileSync(artOutputPath, artHTML);
    
    console.log('✅ Successfully built art.html from content data');
    
  } catch (error) {
    console.error('❌ Error building site:', error);
    process.exit(1);
  }
}

// Run the build
buildSite(); 