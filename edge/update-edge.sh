#!/bin/bash
# Ensures offline updates by unpacking a tarball into the Nginx directory

TAR_FILE="site-build.tar.gz"
CONTENT_DIR="./www-content"
TMP_DIR="./www-tmp"
OLD_DIR="./www-old"

# Ensure the tar file exists in the current directory
if [ ! -f "$TAR_FILE" ]; then
    echo "Error: $TAR_FILE not found! Please place the USB drive file here."
    exit 1
fi

echo "Extracting new build..."
mkdir -p $TMP_DIR
tar -xzf $TAR_FILE -C $TMP_DIR

echo "Swapping directories..."
# Back up existing content if it exists
if [ -d "$CONTENT_DIR" ]; then
    mv $CONTENT_DIR $OLD_DIR
fi

# Move new extracted files into place
mv $TMP_DIR $CONTENT_DIR

echo "Cleaning up..."
rm -rf $OLD_DIR

echo "Update complete! Nginx is now serving the new files."
