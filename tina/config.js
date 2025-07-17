import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "1b05e708-d9d0-4fd7-83ac-3ecf5ec12662",
  // Get this from tina.io  
  token: process.env.TINA_TOKEN || "fake-token-for-local-dev",

  build: {
    outputFolder: "admin",
    publicFolder: ".",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: ".",
    },
  },
  // See docs on content modeling for more info on how to setup new content models
  // https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "art",
        label: "Art Projects",
        path: "content",
        match: {
          include: "art"
        },
        format: "json",
        ui: {
          allowedActions: {
            create: true,
            delete: true,
          },
        },
        fields: [
          {
            type: "object",
            name: "artProjects",
            label: "Art Projects",
            list: true,
            ui: {
              itemProps: (item) => {
                return { label: item?.title }
              },
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "Project ID",
                required: true,
                description: "Unique identifier for the project (used in URLs)"
              },
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true
              },
              {
                type: "string",
                name: "category",
                label: "Category",
                required: true,
                options: [
                  "Web",
                  "Installation", 
                  "AR",
                  "Video",
                  "Wearable",
                  "ML",
                  "Chrome extension",
                  "Education",
                  "Live coding"
                ]
              },
              {
                type: "string",
                name: "year",
                label: "Year",
                required: true
              },
              {
                type: "string",
                name: "description",
                label: "Short Description",
                required: true,
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "rich-text",
                name: "body",
                label: "Body Content",
                description: "Longer description with HTML support"
              },
              {
                type: "string",
                name: "link",
                label: "Project Link",
                description: "URL to the live project (optional)"
              },
              {
                type: "string",
                name: "linkText",
                label: "Link Text",
                description: "Text for the project link button"
              },
              {
                type: "image",
                name: "previewImage",
                label: "Preview Image",
                required: true,
                description: "Main image shown in the table and on hover"
              },
              {
                type: "image",
                name: "images",
                label: "Gallery Images",
                list: true,
                description: "Additional images for the project gallery"
              }
            ]
          }
        ]
      },
      {
        name: "work",
        label: "Work Projects",
        path: "content",
        match: {
          include: "work"
        },
        format: "json",
        ui: {
          allowedActions: {
            create: true,
            delete: true,
          },
        },
        fields: [
          {
            type: "object",
            name: "workProjects",
            label: "Work Projects",
            list: true,
            ui: {
              itemProps: (item) => {
                return { label: item?.title }
              },
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "Project ID",
                required: true,
                description: "Unique identifier for the project (used in URLs)"
              },
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true
              },
              {
                type: "string",
                name: "category",
                label: "Category",
                required: true,
                description: "Multiple categories separated by commas"
              },
              {
                type: "string",
                name: "year",
                label: "Year",
                required: true
              },
              {
                type: "rich-text",
                name: "description",
                label: "Description",
                required: true,
                description: "Project description with HTML support"
              },
              {
                type: "object",
                name: "images",
                label: "Project Images",
                list: true,
                fields: [
                  {
                    type: "image",
                    name: "src",
                    label: "Image",
                    required: true
                  },
                  {
                    type: "string",
                    name: "alt",
                    label: "Alt Text",
                    required: true
                  }
                ]
              },
              {
                type: "string",
                name: "imageLayout",
                label: "Image Layout",
                required: true,
                options: ["single", "grid"],
                description: "How images should be displayed"
              }
            ]
          }
        ]
      },
      {
        name: "about",
        label: "About Page",
        path: "content",
        match: {
          include: "about"
        },
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title",
            required: true
          },
          {
            type: "image",
            name: "image",
            label: "Profile Image",
            required: true
          },
          {
            type: "rich-text",
            name: "intro",
            label: "Introduction",
            required: true
          },
          {
            type: "rich-text",
            name: "bio",
            label: "Bio",
            required: true
          },
          {
            type: "rich-text",
            name: "contact",
            label: "Contact Info",
            required: true
          },
          {
            type: "object",
            name: "arenaBox",
            label: "Are.na Box",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Box Title"
              },
              {
                type: "string",
                name: "description",
                label: "Box Description"
              },
              {
                type: "string",
                name: "link",
                label: "Box Link"
              }
            ]
          },
          {
            type: "rich-text",
            name: "philosophy",
            label: "Philosophy Section"
          },
          {
            type: "rich-text",
            name: "footer",
            label: "Footer"
          }
        ]
      }
    ],
  },
}); 