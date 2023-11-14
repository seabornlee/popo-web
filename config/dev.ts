import type { UserConfigExport } from "@tarojs/cli";

export default {
  env: {
    SERVER_URL: '"http://localhost:1337"',
  },
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {},
} satisfies UserConfigExport;
