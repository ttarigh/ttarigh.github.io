const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Configure paths
const artProjectsFile = path.join(__dirname, '../data/art-projects.md');
const workProjectsFile = path.join(__dirname, '../data/work-projects.md');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const artOutputPath = path.join(publicDir, 'art.html');
const workOutputPath = path.join(publicDir, 'work.html');

// Template for art page with table layout
const artPageTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Art | TINA TARIGHIAN</title>
    <script src="https://code.jquery.com/jquery.min.js"></script>
    <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.webp" />
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.webp" />
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.webp" />
    <link rel="manifest" href="img/site.webmanifest" />
    <link rel="stylesheet" href="css/portfolio.css" />
  </head>
  <body>
    <div class="container">
      <header class="site-header">
        <h1><a href="index.html" class="home-link">Tina Tarighian:</a> <a href="art.html" class="page-highlight">Art</a></h1>
      </header>
      
      <!-- Image preview stage -->
      <div class="image-stage"></div>
      
      <div class="table-wrapper">
        <table class="projects-table">
          <tbody>
            ${content}
          </tbody>
        </table>
      </div>
    </div>
    <script src="js/script.js"></script>
  </body>
</html>
`;

// Template for work page with grid layout
const workPageTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Work | TINA TARIGHIAN</title>
    <script src="https://code.jquery.com/jquery.min.js"></script>
    <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.webp" />
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.webp" />
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.webp" />
    <link rel="manifest" href="img/site.webmanifest" />
    <link rel="stylesheet" href="css/portfolio.css" />
    <link rel="stylesheet" href="css/work-layout.css" />
  </head>
  <body class="work-page">
    <div class="container">
      <header class="site-header">
        <h1><a href="index.html" class="home-link">Tina Tarighian:</a> <a href="work.html" class="page-highlight">Work</a></h1>
      </header>
      
      <div class="work-projects">
        ${content}
      </div>
    </div>
    <script src="js/script.js"></script>
  </body>
</html>
`;

// Template for each art project row and its expandable content
const artProjectRowTemplate = (project) => `
<tr class="project-row" data-project-id="${project.title.replace(/\s+/g, '-').toLowerCase()}" 
    data-preview-image="${project.images && project.images.length > 0 ? `images/${project.category}/${project.images[0]}` : ''}">
  <td class="col-project">${project.title}</td>
  <td class="col-category">${project.tags && project.tags.length > 0 ? project.tags[0].charAt(0).toUpperCase() + project.tags[0].slice(1) : 'Project'}</td>
  <td class="col-year">${project.date ? new Date(project.date).getFullYear() : ''}</td>
</tr>
<tr class="project-details" id="${project.title.replace(/\s+/g, '-').toLowerCase()}-details">
  <td colspan="3">
    <div class="details-container">
      <div class="details-grid">
        <div class="details-info">
          <div class="details-description">${project.description}</div>
          ${project.body ? `<div class="details-body">${project.body}</div>` : ''}
          ${project.link ? `<a href="${project.link}" class="details-link" target="_blank">${project.link_text || 'View Project'}</a>` : ''}
        </div>
        <div class="details-images">
          ${project.images ? project.images.map(img => `<img src="images/${project.category}/${img}" alt="${project.title}" />`).join('') : ''}
        </div>
      </div>
    </div>
  </td>
</tr>
`;

// Template for each work project in grid layout
const workProjectTemplate = (project) => `
<section class="work-project" id="${project.title.replace(/\s+/g, '-').toLowerCase()}">
  <h2 class="work-title">${project.title}</h2>
  
  <div class="work-content">
    <div class="work-info">
      <div class="work-meta">
        <div class="work-category">${project.tags && project.tags.length > 0 ? project.tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ') : 'Project'}</div>
        <div class="work-year">${project.date ? new Date(project.date).getFullYear() : ''}</div>
      </div>
      
      <div class="work-description">
        ${project.description}
        ${project.body ? project.body : ''}
      </div>
    </div>
    
    <div class="work-images">
      ${project.images && project.images.length > 0 ? 
        `<div class="images-grid ${project.images.length === 1 ? 'single-image' : ''}">
          ${project.images.map(img => 
            `<div class="image-container">
              <img src="images/${project.category}/${img}" alt="${project.title}" />
            </div>`
          ).join('')}
        </div>` : ''}
    </div>
  </div>
</section>
`;

// Function to parse projects from a markdown file
function parseProjectsFile(filePath, category) {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`Warning: ${filePath} does not exist`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const projects = [];
  
  // Split content by project (using ## as delimiter)
  const projectSections = content.split('\n## ');
  
  // Skip the first section if it's just the title
  const startIndex = projectSections[0].startsWith('# ') ? 1 : 0;
  
  for (let i = startIndex; i < projectSections.length; i++) {
    const section = i === 0 ? projectSections[i] : '## ' + projectSections[i];
    
    // Extract project title
    const titleMatch = section.match(/## (.+?)(?:\n|$)/);
    if (!titleMatch) continue;
    
    const title = titleMatch[1].trim();
    
    // Extract metadata
    const metadata = {
      title,
      category,
      description: '',
      date: '',
      link: '',
      link_text: '',
      images: [],
      tags: []
    };
    
    // Parse metadata lines (starting with '- ')
    const metadataLines = section.match(/- .+?: .+/g) || [];
    metadataLines.forEach(line => {
      const [key, value] = line.substring(2).split(/: (.+)/);
      
      if (key === 'images' || key === 'tags') {
        // Parse array values
        const arrayValue = value.replace(/^\[|\]$/g, '').split(', ').map(s => s.trim());
        metadata[key] = arrayValue;
      } else {
        metadata[key] = value;
      }
    });
    
    // Extract content (everything after metadata lines)
    const contentLines = section.split('\n');
    let contentStartIndex = 0;
    
    // Find where metadata ends and content begins
    for (let j = 0; j < contentLines.length; j++) {
      if (!contentLines[j].startsWith('- ') && contentLines[j].trim() !== '' && j > 1) {
        contentStartIndex = j;
        break;
      }
    }
    
    const projectContent = contentLines.slice(contentStartIndex).join('\n').trim();
    
    // Process the description to ensure links are properly formatted
    if (metadata.description) {
      // Parse the description with marked to handle links
      metadata.description = marked.parse(metadata.description);
      // Remove paragraph tags that marked adds to the description
      metadata.description = metadata.description.replace(/<\/?p>/g, '');
    }
    
    // Parse the project content with marked
    if (projectContent) {
      // Remove the title and metadata from the content before parsing
      const cleanedContent = projectContent
        .replace(/^## .*$/m, '') // Remove title
        .replace(/^- [a-zA-Z_]+?: .*$/gm, '') // Only remove metadata lines with key-value pairs
        .trim();
        
      if (cleanedContent) {
        metadata.body = marked.parse(cleanedContent);
      } else {
        metadata.body = '';
      }
    } else {
      metadata.body = '';
    }
    
    projects.push(metadata);
  }
  
  // Sort by date
  return projects.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Function to copy a file or directory recursively
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      // Skip node_modules and .git directories
      if (entry === 'node_modules' || entry === '.git' || entry === 'public') {
        continue;
      }
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      copyRecursive(srcPath, destPath);
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Build the pages
function buildPages() {
  // Get all projects
  const artProjects = parseProjectsFile(artProjectsFile, 'art');
  const workProjects = parseProjectsFile(workProjectsFile, 'work');
  
  // Generate HTML content for each project using different templates
  const artRows = artProjects.map(artProjectRowTemplate).join('');
  const workSections = workProjects.map(workProjectTemplate).join('');
  
  // Generate the full pages with different layouts
  const artPage = artPageTemplate(artRows);
  const workPage = workPageTemplate(workSections);
  
  // Write to files
  fs.writeFileSync(artOutputPath, artPage);
  fs.writeFileSync(workOutputPath, workPage);
  
  // Copy static files to public directory
  const rootDir = path.join(__dirname, '..');
  
  // Copy index.html and other HTML files
  const htmlFiles = ['index.html', 'about.html', 'mobileindex.html', 'mindex.html'];
  htmlFiles.forEach(file => {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(publicDir, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  // Copy directories
  const directories = ['css', 'js', 'images', 'img', 'splash'];
  directories.forEach(dir => {
    const srcPath = path.join(rootDir, dir);
    const destPath = path.join(publicDir, dir);
    if (fs.existsSync(srcPath)) {
      copyRecursive(srcPath, destPath);
    }
  });
  
  console.log('Art and Work pages built successfully!');
  console.log('All static files copied to public directory.');
}

// Execute the build
buildPages(); 