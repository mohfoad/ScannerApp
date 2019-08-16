package com.scannerapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import org.reactnative.camera.RNCameraPackage;
import com.bugsnag.BugsnagReactNative;
import com.apsl.versionnumber.RNVersionNumberPackage;
import org.reactnative.camera.RNCameraPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.bugsnag.BugsnagReactNative;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNGestureHandlerPackage(),
            new ReanimatedPackage(),
            new RNVersionNumberPackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new RNLocalizePackage(),
            new KCKeepAwakePackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new RNDeviceInfo(),
            new CookieManagerPackage(),
            new ReactNativeConfigPackage(),
            new RNCameraPackage(),
            BugsnagReactNative.getPackage(),
            new RNVersionNumberPackage(),
            new RNCameraPackage(),
            new RNLocalizePackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new KCKeepAwakePackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new RNDeviceInfo(),
            new CookieManagerPackage(),
            new ReactNativeConfigPackage(),
            BugsnagReactNative.getPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
