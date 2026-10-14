# iSCOOP EPC Website — Multipage Package

This package keeps the visual language established in the supplied homepage:

* cream/white canvas
* deep ink typography
* iSCOOP green + lime accents
* rounded 2xl/3xl cards
* glass-style fixed navigation
* Framer-style reveal motion
* responsive mobile navigation

## Pages

* index.html — supplied homepage, with navigation/CTAs wired to the new pages
* homes.html — Solar Power for Homes
* business.html — Solar That Keeps Business Moving
* commercial.html — Commercial Solar EPC
* packages.html — package comparison and approved package schedule
* finance.html — Flexible Ways to Own Your Solar System
* epc-services.html — Engineering, Procurement \& Construction
* support.html — Support Beyond Installation
* service-request.html — technical service request form
* about.html — Building Dependable Energy Solutions
* faq.html — FAQ
* quote.html — Tell Us What You Want to Power

## Shared files

* styles.css — shared visual layer
* script.js — navigation, reveal animations, form demo states, year, package selection
* assets/iscoop-logo.png — extracted iSCOOP logo from the supplied content pack

## Managing project stories with Pages CMS

The repository includes a Pages CMS configuration in `.pages.yml`. After this site is pushed to GitHub, install/connect the repository in [Pages CMS](https://pagescms.org/) and open the **Projects** collection. Project records are stored in `data/projects.json`; uploaded images are stored in `assets/projects/`.

Create or edit a project, choose its type and scale, add verified public details, and turn on **Publish on website** when it is approved for public sharing. Save the change to GitHub. The deployed `projects.html` page reads the JSON file and displays published records in its filterable project catalogue.

The site must be served over HTTP(S) for the browser to load the project JSON file; opening `projects.html` directly from a local file path does not support this fetch.

