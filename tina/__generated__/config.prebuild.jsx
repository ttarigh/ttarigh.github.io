// tina/config.js
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "fake-client-id-for-local-dev",
  // Get this from tina.io  
  token: process.env.TINA_TOKEN || "fake-token-for-local-dev",
  build: {
    outputFolder: "admin",
    publicFolder: "."
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "."
    }
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
          include: "**/art"
        },
        format: "json",
        fields: [
          {
            type: "object",
            name: "artProjects",
            label: "Art Projects",
            list: true,
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
                type: "object",
                name: "images",
                label: "Gallery Images",
                list: true,
                fields: [
                  {
                    type: "image",
                    name: "src",
                    label: "Image"
                  },
                  {
                    type: "string",
                    name: "alt",
                    label: "Alt Text"
                  }
                ]
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
          include: "**/about"
        },
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title"
          },
          {
            type: "rich-text",
            name: "content",
            label: "About Content"
          },
          {
            type: "image",
            name: "image",
            label: "Profile Image"
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
