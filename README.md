<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/585dbfbf-5ccd-4f4e-9091-5ad5ce39af21

AgroTech — AI Plant Disease Detection Web App

AI-powered web application that detects plant diseases from leaf images and provides diagnosis, treatment suggestions, and health insights using computer vision.

🚀 About

AgroTech is a smart agriculture project developed for hackathons aiming to help farmers and gardeners quickly identify plant diseases using computer vision. Simply upload a photo of a leaf and the app will:

✅ Detect if the plant is diseased
✅ Provide diagnosis and treatment guidance
✅ Give health insights and suggestions

This makes plant health monitoring easier, faster, and more accessible — especially in low-resource settings.

🛠️ Features

📸 Image upload for leaf photos

🤖 Disease detection using deep learning/ML models

💡 Treatment suggestions and health insights

🌐 Web interface built with modern frameworks

🚢 Deployable locally or online

📁 Tech Stack
Technology	Purpose
TypeScript / JavaScript	Core logic & app behavior
Node / Deno (server.ts)	Server backend
Vite	Build tool
Computer Vision Model	AI for disease detection
Frontend (HTML/CSS)	User interface
.env	Environment configs
💻 Installation & Running Locally

Clone this repo

git clone https://github.com/nishithadolu123/HACKATHON-AgroTech.git
cd HACKATHON-AgroTech

Install dependencies

npm install

Copy environment example

cp .env.example .env

Run locally

npm run dev
🚀 Deployment

You can deploy the app via platforms like AI Studio, Vercel, Netlify, or Render.
For AI Studio deployment, visit the link shown in this README or follow AI Studio project instructions to publish live.

👇 Example:
🔗 https://ai.studio/apps/585dbfbf-5ccd-4f4e-9091-5ad5ce39af21

📌 Usage

Open the app in a browser.

Upload a leaf image.

Wait for model prediction on health/disease.

Read diagnosis and actionable insights.

🗂️ Project Structure
📦HACKATHON-AgroTech
 ┣ 📂src
 ┣ 📜.env.example
 ┣ 📜README.md
 ┣ 📜index.html
 ┣ 📜server.ts
 ┣ 📜package.json
 ┣ 📜vite.config.ts
🤝 Contributing

Thanks for being interested in contributing!

To contribute:

Fork this repository.

Create a new branch: git checkout -b feature/YourFeature

Make changes and commit: git commit -m "Add new feature"

Push: git push origin feature/YourFeature

Open a pull request (PR) with a description of your changes.

📝 License

Specify your project license (e.g., MIT, Apache 2.0, GPL-3.0, etc.).
(Update this based on what you choose.)
