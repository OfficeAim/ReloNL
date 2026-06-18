# ReloNL Deployment & Maintenance Guide

This guide outlines the process for deploying and maintaining the ReloNL platform, which is designed as a single-file, production-ready `index.html` application.

## 🚀 Deployment to Netlify Drop

ReloNL is optimized for **zero-configuration deployment** using [Netlify Drop](https://app.netlify.com/drop).

### Step-by-Step Deployment:

1.  **Prepare the File:** Ensure you have the complete `index.html` file (which includes all CSS, JavaScript, and HTML in a single file).
2.  **Visit Netlify Drop:** Open your web browser and navigate to [https://app.netlify.com/drop](https://app.netlify.com/drop).
3.  **Drag and Drop:** Drag the `index.html` file directly into the designated area on the Netlify Drop page.
4.  **Instant Deployment:** Netlify will automatically detect the file and deploy your site instantly. You will be provided with a unique URL for your live site.
5.  **Custom Domain (Optional):** If you wish to use a custom domain, you can configure it within your Netlify dashboard after the initial deployment.

> **Note:** Because ReloNL is a single-file application with no external dependencies (other than CDNs), Netlify Drop provides the simplest and fastest deployment method.

## 🛠️ Maintenance & Updates

Maintaining ReloNL primarily involves updating the `index.html` file itself.

### Update Procedure:

1.  **Edit `index.html`:** Make any necessary changes or additions directly to the `index.html` file. This includes content updates, feature enhancements, or bug fixes.
2.  **Re-deploy:** Once changes are complete, simply re-deploy the updated `index.html` file to Netlify Drop (or your chosen hosting provider). Netlify will automatically handle versioning and updates.

### Key Maintenance Considerations:

*   **LocalStorage:** All user data (onboarding, verified badge, credits, etc.) is stored in the user's browser via `LocalStorage`. Updates to the `index.html` file will **not** affect existing user data in their browsers.
*   **CDN Dependencies:** Ensure that the CDN links for Tailwind CSS, Chart.js, and QR Server API remain valid and accessible. These are external services and are not hosted by ReloNL.
*   **Performance:** Regularly review the `index.html` file for any large assets or inefficient code that could impact loading times, especially for users with slower internet connections.
*   **Security:** As a client-side application, ReloNL relies on client-side heuristics for features like the Scam Detector. For any sensitive operations, external, secure backend services would be required (which are not part of the current single-file architecture).

## 💡 Tips for Development

*   **Browser Developer Tools:** Utilize your browser's developer console for debugging JavaScript and inspecting CSS.
*   **Tailwind JIT:** While using the CDN, be mindful that custom Tailwind classes might not be purged. For larger projects, a build step with Tailwind JIT would be more efficient.
*   **Modularity (within a single file):** Use clear comments and logical sectioning within the `index.html` file to keep the code organized and maintainable, despite its single-file nature.
