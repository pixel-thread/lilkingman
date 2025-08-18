// @ts-nocheck

const { withAndroidManifest, withAppBuildGradle, withPodfile } = require('@expo/config-plugins');

const withRazorpay = (config) => {
  // Add INTERNET permission to AndroidManifest.xml
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }

    const hasInternet = manifest['uses-permission'].some(
      (perm) => perm.$['android:name'] === 'android.permission.INTERNET'
    );

    if (!hasInternet) {
      manifest['uses-permission'].push({
        $: { 'android:name': 'android.permission.INTERNET' },
      });
    }
    return config;
  });

  // Add Razorpay dependency in android/app/build.gradle
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      let buildGradle = config.modResults.contents;

      if (!buildGradle.includes('com.razorpay:checkout')) {
        buildGradle = buildGradle.replace(
          /dependencies\s?{([\s\S]*?)}/,
          (match, deps) =>
            `dependencies {\n        implementation 'com.razorpay:checkout:1.6.33'\n${deps}\n}`
        );
      }

      config.modResults.contents = buildGradle;
    }
    return config;
  });

  // Add iOS Pod for Razorpay
  config = withPodfile(config, (config) => {
    if (!config.modResults.contents.includes('razorpay-pod')) {
      config.modResults.contents += `\npod 'razorpay-pod'`;
    }
    return config;
  });

  return config;
};

module.exports = withRazorpay;
