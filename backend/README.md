## Setting up the Google Cloud Vision API

There are a couple steps required before being able to access the GCloud Vision API. These steps are,
- Enable the $300 Free Trial, *and enable billing*
- Create a Google Cloud project
- Enable the IAM API
- Enable the Cloud Vision API
- Create a service account
- Generate a service account key
- Rename the key to `credentials.json` and move it to `src/main/resources`

### Guides and Links

Useful links include:
- [How to create a service account](https://cloud.google.com/iam/docs/service-accounts-create)
- [Cloud Vision API Enable Link](https://console.cloud.google.com/apis/library/vision.googleapis.com)
- [Identity and Access Management (IAM) API](https://console.cloud.google.com/apis/library/iam.googleapis.com)
