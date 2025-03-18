# Deploying to Vercel for tina.zone

This repository includes a `vercel.json` configuration file that allows you to proxy your GitHub Pages content (ttarigh.github.io) through your Vercel-hosted domain (tina.zone).

## Setup Instructions

1. **Create a Vercel account** if you don't already have one at [vercel.com](https://vercel.com)

2. **Install the Vercel CLI** (optional but recommended):
   ```
   npm install -g vercel
   ```

3. **Login to Vercel** from the command line:
   ```
   vercel login
   ```

4. **Deploy to Vercel** from the repository root:
   ```
   vercel
   ```
   
   Or deploy directly from GitHub by:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import this GitHub repository
   - Configure the project settings
   - Deploy

5. **Configure your custom domain**:
   - Go to your Vercel project settings
   - Navigate to the "Domains" section
   - Add your domain (tina.zone)
   - Follow the instructions to verify domain ownership

## How It Works

The `vercel.json` file contains rewrite rules that forward requests from your Vercel domain to your GitHub Pages site. For example:

- `tina.zone/art` → `ttarigh.github.io/art.html`
- `tina.zone/infinite-podcast` → `ttarigh.github.io/infinite-podcast/index.html`
- `tina.zone/vitamin` → `ttarigh.github.io/vitamin/index.html`

The configuration includes specific rules for your projects and a catch-all rule for any other paths.

## Adding New Projects

When you create a new project on GitHub Pages, you should:

1. Add specific rewrite rules to the `vercel.json` file:
   ```json
   {
     "source": "/new-project-name",
     "destination": "https://ttarigh.github.io/new-project-name/index.html"
   },
   {
     "source": "/new-project-name/:path*",
     "destination": "https://ttarigh.github.io/new-project-name/:path*"
   }
   ```

2. Redeploy to Vercel:
   ```
   vercel --prod
   ```

## Troubleshooting

- **Redirect Loops**: If you encounter "too many redirects" errors, make sure you have:
  1. Separate rules for the root path and subpaths of each project
  2. Point root paths directly to index.html files (e.g., `/vitamin` → `/vitamin/index.html`)
  3. Use the `:path*` pattern for subpaths instead of regex patterns
  4. Added proper cache control headers to prevent caching issues

- **CORS Issues**: The configuration includes CORS headers to allow cross-origin requests.
- **404 Errors**: Make sure the path in the GitHub Pages repository matches the path in the rewrite rule.

## Maintenance

Remember to update the `vercel.json` file whenever you:

1. Add new projects to your GitHub Pages site
2. Rename existing projects
3. Change the structure of your GitHub Pages repository

After making changes to `vercel.json`, redeploy to Vercel:
```
vercel --prod
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Rewrites Documentation](https://vercel.com/docs/concepts/projects/project-configuration#rewrites)
- [GitHub Pages Documentation](https://docs.github.com/en/pages) 