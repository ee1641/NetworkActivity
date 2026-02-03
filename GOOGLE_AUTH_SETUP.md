# Setting up Google Sign-In with Supabase

To get Google Sign-In working, you need to generate a **Client ID** and **Client Secret** from the Google Cloud Console and add them to your Supabase project.

## Step 1: Create a Google Cloud Project

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the project dropdown in the top-left and select **"New Project"**.
3.  Give it a name (e.g., "Network Activity Auth") and click **Create**.

## Step 2: Configure OAuth Consent Screen

1.  In the left sidebar, go to **APIs & Services** > **OAuth consent screen**.
2.  Select **External** (unless you are a G-Suite user) and click **Create**.
3.  Fill in the required fields:
    *   **App Name**: BlockAnalytics (or your app name)
    *   **User Support Email**: Your email.
    *   **Developer Contact Information**: Your email.
4.  Click **Save and Continue** through the "Scopes" and "Test Users" sections (you can leave them default for now).
5.  On the Summary page, click **Back to Dashboard**.

## Step 3: Create Credentials (Client ID & Secret)

1.  In the left sidebar, go to **APIs & Services** > **Credentials**.
2.  Click **+ CREATE CREDENTIALS** at the top and select **OAuth client ID**.
3.  **Application type**: Select **Web application**.
4.  **Name**: Web Client 1 (default is fine).
5.  **Authorized JavaScript origins**:
    *   Add your local URL: `http://localhost:5173`
    *   Add your Supabase project URL: `https://lkaepkmzlklrdfshpjdf.supabase.co`
6.  **Authorized redirect URIs**:
    *   You need to get this from Supabase.
    *   Go to your **Supabase Dashboard** > **Authentication** > **Providers** > **Google**.
    *   Copy the **Callback URL (for OAuth)** (it looks like `https://<project-ref>.supabase.co/auth/v1/callback`).
    *   Paste that URL here in Google Cloud Console.
7.  Click **Create**.

## Step 4: Add Credentials to Supabase

1.  After clicking Create, a popup will show your **Client ID** and **Client Secret**.
2.  Copy the **Client ID**.
3.  Go to your **Supabase Dashboard** > **Authentication** > **Providers** > **Google**.
4.  Paste the **Client ID** into the "Client ID" field.
5.  Copy the **Client Secret** from Google Cloud.
6.  Paste it into the "Client Secret" field in Supabase.
7.  Ensure "Enable Sign in with Google" is toggled **ON**.
8.  Click **Save**.

## Step 5: Test It

Now, when you click the "Google" button on your login page, it should open the Google login popup correctly!
