import * as Cesium from "cesium";
import Sandcastle from "Sandcastle";

const viewer = new Cesium.Viewer("cesiumContainer");
let isSecondTextureLoaded = false;

async function makeColorTextureDataArray(textureSize, color) {
  const dataArray = new Uint8ClampedArray(4 * textureSize * textureSize);

  for (let y = 0; y < textureSize; ++y) {
    for (let x = 0; x < textureSize; ++x) {
      const index = 4 * (y * textureSize + x);
      dataArray[index] = color.red * 255; // R
      dataArray[index + 1] = color.green * 255; // G
      dataArray[index + 2] = color.blue * 255; // B
      dataArray[index + 3] = 255; // A
    }
  }

  return dataArray;
}

const texture = await makeColorTextureDataArray(256, Cesium.Color.DARKORANGE);

const customShader = new Cesium.CustomShader({
  lightingModel: Cesium.LightingModel.UNLIT,
  uniforms: {
    u_tex: {
      type: Cesium.UniformType.SAMPLER_2D,
      value: new Cesium.TextureUniform({
        typedArray: texture,
        width: 256,
        height: 256,
        pixelFormat: Cesium.PixelFormat.RGBA,
      }),
    },
  },
  fragmentShaderText: `
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
    {
      material.diffuse = texture(u_tex, fsInput.attributes.texCoord_0).rgb;
    }
  `,
});

try {
  const position = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 0);
  const hpr = new Cesium.HeadingPitchRoll(0, 0, 0);
  const fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator(
    "north",
    "west",
  );
  const model = viewer.scene.primitives.add(
    await Cesium.Model.fromGltfAsync({
      url: "../../SampleData/models/CesiumMilkTruck/CesiumMilkTruck.glb",
      customShader: customShader,
      modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpr,
        Cesium.Ellipsoid.WGS84,
        fixedFrameTransform,
      ),
    }),
  );

  const removeListener = model.readyEvent.addEventListener(() => {
    viewer.camera.flyToBoundingSphere(model.boundingSphere, {
      duration: 0.0,
    });

    removeListener();
  });
} catch (error) {
  console.log(`Error loading model: ${error}`);
}

async function toggleTextureRegion() {
  if (isSecondTextureLoaded) {
    // Replace the whole texture.
    const textureArray = await makeColorTextureDataArray(
      256,
      Cesium.Color.DARKORANGE,
    );
    const imageData = new ImageData(textureArray, 256, 256);
    const bitmap = await createImageBitmap(imageData);
    customShader.setTextureRegion("u_tex", bitmap, 0, 0);
    isSecondTextureLoaded = false;
  } else {
    // Replace a part of the texture.
    const textureArray = await makeColorTextureDataArray(
      104,
      Cesium.Color.DARKBLUE,
    );
    const imageData = new ImageData(textureArray, 104, 104);
    const bitmap = await createImageBitmap(imageData);
    customShader.setTextureRegion("u_tex", bitmap, 15, 10);
    isSecondTextureLoaded = true;
  }
}

Sandcastle.addToolbarButton("Toggle swapped texture region", function () {
  toggleTextureRegion();
});
