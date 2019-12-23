import * as THREE from 'three';
import {Platform} from 'react-native';
import {Asset} from 'expo-asset';
import {getEmbeddedAssetUri} from 'expo-asset/src/EmbeddedAssets';
import URLParse from 'url-parse';
//@ts-ignore
import * as THREEModule from 'three/build/three.module';
import {FileSystem} from 'react-native-unimodules';
// JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
function formatFromURI(uri: string) {
  const isJPEG =
    uri.search(/\.jpe?g($|\?)/i) > 0 || uri.search(/^data\:image\/jpeg/) === 0;

  return isJPEG ? THREE.RGBFormat : THREE.RGBAFormat;
}

export default class ExpoTextureLoader extends THREE.TextureLoader {
  load(
    asset: any,
    onLoad?: (texture: THREE.Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: any) => void,
  ): THREE.Texture {
    if (!asset) {
      throw new Error(
        'ExpoTHREE.TextureLoader.load(): Cannot parse a null asset',
      );
    }

    let texture: THREE.Texture & {
      isDataTexture?: Boolean;
    } = new THREE.Texture();

    const loader = new THREE.ImageLoader(this.manager);
    loader.setCrossOrigin(this.crossOrigin);
    loader.setPath(this.path);
    (async () => {
      const nativeAsset: Asset = THREEModule.Cache.get(asset);
      function parseAsset(image: any) {
        texture.image = image;

        // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
        texture.format = formatFromURI(nativeAsset.uri);
        texture.needsUpdate = true;

        if (onLoad !== undefined) {
          onLoad(texture);
        }
      }

      if (Platform.OS === 'web') {
        /*   loader.load(
          nativeAsset.localUri!,
          image => {
            parseAsset(image);
          },
          onProgress,
          onError,
        ); */
      } else {
        texture['isDataTexture'] = true; // Forces passing to `gl.texImage2D(...)` verbatim
        texture.minFilter = THREE.LinearFilter; // Pass-through non-power-of-two
        const localUri = `${FileSystem.cacheDirectory}ExponentAsset-${nativeAsset.hash}.${nativeAsset.type}`;
        parseAsset({
          data: {
            localUri: localUri,
          },
          width: nativeAsset.width,
          height: nativeAsset.height,
        });
      }
    })();

    return texture;
  }
}
