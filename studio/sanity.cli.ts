import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'bokvus9l',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  studioHost: 'photography-portfolio-bokvus9l',
  deployment: {
    appId: 'dy75crwfvdcuupxk1gjrzepe',
  },
});
