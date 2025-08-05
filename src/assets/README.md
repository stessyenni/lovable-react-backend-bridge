# Hemapp Assets Directory

This directory contains all customizable images and media assets for the Hemapp project. You can easily replace any asset by simply overwriting the existing file with your new image.

## How to Customize Assets

1. **Replace any image file** in this directory with your own image (keep the same filename)
2. **Supported formats**: SVG, PNG, JPG, JPEG, WebP, GIF
3. **The app will automatically use your new image** after refresh

## Available Assets

### Logos and Branding
- `logo.svg` - Main app logo (used in sidebar header)
- `icon.svg` - App icon for smaller displays
- `app-background.jpg` - Main app background (if needed)
- `hero-background.jpg` - Hero section background

### User Interface
- `user-avatar-placeholder.svg` - Default user avatar placeholder
- `profile-placeholder.svg` - Profile picture placeholder
- `empty-state.svg` - Empty state illustration

### Feature Illustrations
- `diet-illustration.svg` - Diet and nutrition feature illustration
- `health-illustration.svg` - General health feature illustration
- `consultation-illustration.svg` - Doctor consultation illustration
- `emergency-illustration.svg` - Emergency services illustration

### Medical Icons
- `heart-icon.svg` - Heart/health icon
- `pill-icon.svg` - Medication/pill icon
- `activity-icon.svg` - Activity/fitness icon

## Tips for Best Results

1. **SVG Format Recommended**: SVG files scale perfectly at any size and are ideal for icons and logos
2. **Consistent Style**: Keep a consistent visual style across all assets
3. **Appropriate Sizes**: 
   - Icons: 512x512px minimum
   - Illustrations: 512x512px or larger
   - Backgrounds: 1920x1080px or larger
4. **File Names**: Keep the exact same filename when replacing assets

## Technical Notes

- All assets are imported through `src/assets/index.ts`
- The app uses ES6 imports for all assets
- Assets are automatically optimized during build
- Changes to assets require a browser refresh to see updates

## Backup Your Custom Assets

Remember to backup your custom assets before updating the app to preserve your customizations!