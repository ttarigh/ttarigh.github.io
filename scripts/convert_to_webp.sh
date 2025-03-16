#!/bin/bash

# Script to convert all images in the art folder to WebP format
# Requires cwebp (from libwebp) to be installed

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "Error: cwebp is not installed. Please install it using:"
    echo "  brew install webp"
    exit 1
fi

# Set the source directory
SRC_DIR="$(pwd)/images/art"
QUALITY=80

# Create a log file for tracking conversions
LOG_FILE="$(pwd)/scripts/conversion_log.txt"
echo "Image Conversion Log - $(date)" > "$LOG_FILE"
echo "Original filename -> WebP filename" >> "$LOG_FILE"
echo "----------------------------------------" >> "$LOG_FILE"

# Function to convert a file to WebP
convert_to_webp() {
    local input_file="$1"
    local filename=$(basename -- "$input_file")
    local name="${filename%.*}"
    local output_file="${SRC_DIR}/${name}.webp"
    
    # Skip if the file is already a WebP
    if [[ "${filename##*.}" == "webp" ]]; then
        echo "Skipping already WebP file: $filename"
        echo "SKIPPED (already WebP): $filename" >> "$LOG_FILE"
        return 0
    fi
    
    # Skip if the WebP version already exists
    if [ -f "$output_file" ]; then
        echo "WebP version already exists: ${name}.webp"
        echo "SKIPPED (WebP exists): $filename -> ${name}.webp" >> "$LOG_FILE"
        return 0
    fi
    
    # Convert the file
    cwebp -q $QUALITY "$input_file" -o "$output_file"
    
    # Check if conversion was successful
    if [ $? -eq 0 ]; then
        echo "Converted: $filename -> ${name}.webp"
        echo "$filename -> ${name}.webp" >> "$LOG_FILE"
        
        # Get file sizes for comparison
        original_size=$(du -h "$input_file" | cut -f1)
        webp_size=$(du -h "$output_file" | cut -f1)
        echo "  Size: $original_size -> $webp_size" >> "$LOG_FILE"
        
        return 0
    else
        echo "Failed to convert: $filename"
        echo "FAILED: $filename" >> "$LOG_FILE"
        return 1
    fi
}

# Process all image files in the directory
echo "Starting conversion of images in $SRC_DIR"
count=0
success=0

# First process all non-WebP files
for ext in jpg jpeg png gif; do
    for file in "$SRC_DIR"/*.$ext; do
        # Skip if no files match the pattern
        [ -e "$file" ] || continue
        
        count=$((count+1))
        if convert_to_webp "$file"; then
            success=$((success+1))
        fi
    done
done

echo "----------------------------------------"
echo "Conversion complete: $success of $count files converted successfully."
echo "----------------------------------------" >> "$LOG_FILE"
echo "Conversion complete: $success of $count files converted successfully." >> "$LOG_FILE"

# Now update the art-projects.md file to use WebP extensions
echo "Updating art-projects.md file..."

# Path to the art-projects.md file
MD_FILE="$(pwd)/data/art-projects.md"

# Create a backup of the original file
cp "$MD_FILE" "${MD_FILE}.bak"

# Replace image extensions in the markdown file
# This handles cases where the image is referenced with its extension
sed -i '' -E 's/\[(.*)\.(jpg|jpeg|png|gif)\]/[\1.webp]/g' "$MD_FILE"

# Also handle cases where the image is referenced without an extension
# We'll need to check each image reference against our conversion log
while IFS= read -r line; do
    if [[ $line == *"images: ["* && $line != *".webp"* ]]; then
        # Extract the image name
        image_name=$(echo "$line" | sed -E 's/.*images: \[(.*)\].*/\1/')
        
        # Remove any file extension if present
        base_name="${image_name%.*}"
        
        # Replace with WebP version
        sed -i '' "s/images: \[$image_name\]/images: \[$base_name.webp\]/g" "$MD_FILE"
    fi
done < "$MD_FILE"

echo "Updated art-projects.md file. Original backed up as ${MD_FILE}.bak"
echo "Done!" 