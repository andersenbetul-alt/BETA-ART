#!/usr/bin/env bash
# QBLOGG — Vercel build script
# Klonlar main'i ve dist/ oluşturur. vercel.json buildCommand buraya yönlendirir.
set -euo pipefail

git clone --depth 1 --branch main https://github.com/andersenbetul-alt/BETA-ART.git _src
git -C _src rev-parse HEAD
mkdir dist
cp _src/index.html _src/work.html _src/blog.html _src/post.html \
   _src/gizlilik.html _src/kosullar.html _src/kalite.html _src/ornek.html \
   _src/404.html _src/sitemap.xml _src/robots.txt _src/feed.xml dist/
mkdir -p dist/.well-known
cp _src/.well-known/security.txt dist/.well-known/
mkdir -p dist/demo
cp _src/demo/cv-action-page.html _src/demo/cv-action-page.js dist/demo/
cp -r _src/assets dist/assets
