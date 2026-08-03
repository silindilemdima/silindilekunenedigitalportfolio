Silindile Kunene — Static Site Export
=====================================

Plain HTML / CSS / JS. No build step, no server-side code.
Open index.html in a browser, or upload the whole folder to any static host
(GitHub Pages, Netlify, Vercel, cPanel, S3).

Structure
---------
index.html                 Home
about.html                 About
work.html                  Work / Archive
services.html              Services
contact.html               Contact
case-study.html            Momo's Hair Corner
case-study-nelo.html       Nelo Pharmacy
case-study-something.html  Something Property
case-study-klevabari.html  KlevaBari

assets/styles.css          Full compiled stylesheet (all pages)
assets/script.js           Scroll reveals, mobile nav toggle, smooth anchors
assets/images/             All images and video

Notes
-----
- Fonts load from Google Fonts + Fontshare via <link> in each page's <head>.
- All internal links are relative .html files, so it works from a local folder.
- Edit copy directly in the HTML; edit colours/spacing in assets/styles.css.
