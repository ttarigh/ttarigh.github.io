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
    <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png" />
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

// Function to generate HTML for a single work project
function generateWorkProjectHTML(project) {
  const projectId = project.id.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  
  // Format description content
  let descriptionContent = '';
  if (project.description) {
    const htmlContent = richTextToHtml(project.description);
    descriptionContent = htmlContent;
  }
  
  // Generate images HTML based on layout
  let imagesHTML = '';
  let imagesGridClass = project.imageLayout === 'single' ? 'single-image' : '';
  
  if (project.images && project.images.length > 0) {
    const imageContainers = project.images.map(img => {
      const src = typeof img === 'string' ? img : (img.src || img);
      const alt = typeof img === 'object' && img.alt ? img.alt : project.title;
      return `<div class="image-container">
              <img src="${src}" alt="${alt}" />
            </div>`;
    }).join('');
    
    imagesHTML = `<div class="images-grid ${imagesGridClass}">
          ${imageContainers}
        </div>`;
  }

  return `
<section class="work-project" id="${projectId}">
  <h2 class="work-title">${project.title}</h2>
  
  <div class="work-content">
    <div class="work-info">
      <div class="work-meta">
        <div class="work-category">${project.category}</div>
        <div class="work-year">${project.year}</div>
      </div>
      
      <div class="work-description">
        ${descriptionContent}
      </div>
    </div>
    
    <div class="work-images">
      ${imagesHTML}
    </div>
  </div>
</section>`;
}

// Function to generate the complete work.html file
function generateWorkHTML(workData) {
  const projectsHTML = workData.workProjects.map(generateWorkProjectHTML).join('\n        ');
  
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="Tina Tarighian's portfolio of work in AI, creative technology, and digital experiences" />
    <meta name="theme-color" content="#ffffff" />
    <title>Work | TINA TARIGHIAN</title>
    <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png" />
    <link rel="manifest" href="img/site.webmanifest" />
    <link rel="stylesheet" href="css/main.css" />
  </head>
  <body class="work-page">
    <div class="container">
      <header class="site-header">
        <h1><a href="index.html" class="home-link">Tina Tarighian:</a> <a href="art.html" class="page-link">Art</a> | <a href="work.html" class="page-highlight">Work</a></h1>
      </header>
      
      <div class="work-projects">
        ${projectsHTML}
      </div>
    </div>
    <script src="js/main.js"></script>
  </body>
</html>`;
}

// Function to generate the complete about.html file
function generateAboutHTML(aboutData) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TINA TARIGHIAN</title>

    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="img/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="img/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="img/favicon-16x16.png"
    />
    <link rel="manifest" href="img/site.webmanifest" />

    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 18px;
        min-height: 100vh;
        margin: 0;
        padding: 0 20px;
        box-sizing: border-box;
      }
      
      .gradient-background {
        background: linear-gradient(to bottom, white, #d0d0d0);
      }
      
      .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px 0;
        position: relative;
      }
      
      h1 {
        font-size: clamp(36px, 5vw, 50px);
        margin-bottom: 20px;
      }
      
      p {
        margin-bottom: 16px;
        line-height: 1.4;
      }
      
      a {
        color: blue;
      }
      
      .content-wrapper {
        display: flex;
        flex-direction: row;
        gap: 30px;
      }
      
      .text-content {
        flex: 1;
        max-width: 800px;
      }
      
      .image-content {
        flex: 1;
        display: flex;
        align-items: flex-start;
        justify-content: center;
      }
      
      .image-content img {
        max-width: 80%;
        height: auto;
      }
      
      .back-button {
        position: fixed;
        top: 20px;
        left: 20px;
        font-size: 50px;
        color: red;
        text-decoration: none;
        z-index: 100;
        line-height: 0.8;
      }
      
      .arena-box {
        display: inline-block;
        background-color: white;
        border: 1px solid #ddd;
        padding: 15px;
        margin: 20px 0;
        border-radius: 5px;
        text-decoration: none;
        color: inherit;
        transition: background-color 0.2s;
      }
      
      .arena-box:hover {
        background-color: #f5f5f5;
      }
      
      .arena-box h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
      }
      
      .arena-box p {
        margin: 0;
        font-size: 14px;
        color: #666;
      }
      
      @media (max-width: 900px) {
        .content-wrapper {
          flex-direction: column;
        }
        
        .image-content {
          order: -1;
        }
        
        .image-content img {
          max-width: 100%;
        }
        
        body {
          font-size: 16px;
          padding: 0 15px;
        }
        
        .back-button {
          position: absolute;
          top: 10px;
          left: 10px;
        }
        
        .container {
          padding: 40px 0;
        }
      }
    </style>
  </head>
  <body class="gradient-background">
    <div class="container">
        <a href="#" id="backToSplash" class="back-button">←</a>
        <h1 style="margin-bottom: 20px;">${aboutData.title}</h1>
        <div class="content-wrapper">
          <div class="text-content">
            ${richTextToHtml(aboutData.intro)}
            ${richTextToHtml(aboutData.bio)}
            ${richTextToHtml(aboutData.contact)}
            
            ${aboutData.arenaBox ? `<a href="${aboutData.arenaBox.link}" class="arena-box">
              <h3>${aboutData.arenaBox.title}</h3>
              <p>${aboutData.arenaBox.description}</p>
            </a>` : ''}
            
            <div class="artsy-text">
            ${richTextToHtml(aboutData.philosophy)}
          </div>
            ${richTextToHtml(aboutData.footer)}
          
          </div>
          <div class="image-content">
            <img id="workspace" src="${aboutData.image}" alt="workspace">
          </div>
        </div>
    </div>
  </body>
  <script>
    // Back button functionality
    document.getElementById('backToSplash').addEventListener('click', function(e) {
      e.preventDefault();
      window.history.back();
    });
    
    // Splash link functionality
    const splashLink = document.getElementById('splashLink');
    if (splashLink) {
      splashLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'index.html';
      });
    }
  </script>
</html>`;
}

// Main build function
function buildSite() {
  try {
    let builtFiles = [];
    
    // Read and build art projects
    const artDataPath = path.join(__dirname, '../content/art.json');
    if (fs.existsSync(artDataPath)) {
      const artData = JSON.parse(fs.readFileSync(artDataPath, 'utf8'));
      const artHTML = generateArtHTML(artData);
      const artOutputPath = path.join(__dirname, '../art.html');
      fs.writeFileSync(artOutputPath, artHTML);
      builtFiles.push('art.html');
    }
    
    // Read and build work projects
    const workDataPath = path.join(__dirname, '../content/work.json');
    if (fs.existsSync(workDataPath)) {
      const workData = JSON.parse(fs.readFileSync(workDataPath, 'utf8'));
      const workHTML = generateWorkHTML(workData);
      const workOutputPath = path.join(__dirname, '../work.html');
      fs.writeFileSync(workOutputPath, workHTML);
      builtFiles.push('work.html');
    }
    
    // Read and build about page
    const aboutDataPath = path.join(__dirname, '../content/about.json');
    if (fs.existsSync(aboutDataPath)) {
      const aboutData = JSON.parse(fs.readFileSync(aboutDataPath, 'utf8'));
      const aboutHTML = generateAboutHTML(aboutData);
      const aboutOutputPath = path.join(__dirname, '../about.html');
      fs.writeFileSync(aboutOutputPath, aboutHTML);
      builtFiles.push('about.html');
    }
    
    if (builtFiles.length > 0) {
      console.log(`✅ Successfully built: ${builtFiles.join(', ')}`);
    } else {
      console.log('⚠️ No content files found to build');
    }
    
  } catch (error) {
    console.error('❌ Error building site:', error);
    process.exit(1);
  }
}

// Run the build
buildSite(); 