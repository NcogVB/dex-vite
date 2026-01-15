// wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygonAmoy } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'dex earth',
  projectId: '1a67b66fb91dd506ee6e585714d0568e', 
  chains: [polygonAmoy], 
  ssr: false, 
});