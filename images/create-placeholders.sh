#!/bin/bash

# Create placeholder landscape images for apps
echo "Creating placeholder landscape images..."

# Create app1 landscape image
convert -size 1200x600 gradient:blue-purple -gravity center \
  -pointsize 60 -fill white -annotate 0 "App1 Landscape" \
  images/app1-landscape.jpg

# Create app2 landscape image
convert -size 1200x600 gradient:green-teal -gravity center \
  -pointsize 60 -fill white -annotate 0 "App2 Landscape" \
  images/app2-landscape.jpg

# Create app3 landscape image
convert -size 1200x600 gradient:orange-red -gravity center \
  -pointsize 60 -fill white -annotate 0 "App3 Landscape" \
  images/app3-landscape.jpg

# Create app4 landscape image
convert -size 1200x600 gradient:purple-pink -gravity center \
  -pointsize 60 -fill white -annotate 0 "App4 Landscape" \
  images/app4-landscape.jpg

# Create app5 landscape image
convert -size 1200x600 gradient:teal-blue -gravity center \
  -pointsize 60 -fill white -annotate 0 "App5 Landscape" \
  images/app5-landscape.jpg

echo "Placeholder landscape images created successfully!"