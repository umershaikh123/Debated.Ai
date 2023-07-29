import { useRef, useEffect, useLayoutEffect } from 'react';
import { useTheme } from 'components/ThemeProvider';
import { Transition } from 'components/Transition';
import { useInViewport, useWindowSize } from 'hooks';
import {
  Color,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
  AnimationMixer,
  MeshStandardMaterial,
  PointLight,
} from 'three';
import { rgbToThreeColor } from 'utils/style';
import { cleanRenderer, cleanScene, degToRad, modelLoader, removeLights } from 'utils/three';
import styles from './RobotsModel.module.css';
import robotModelPath from 'assets/models/robots.glb';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Define lights
const createLights = () => {
  const dirLight = new DirectionalLight(0xffffff, 5.1);
  const pointLight = new PointLight(0xffffff, 2.5);
  const pointLight2 = new PointLight(0xbd009a, 2.5);
  dirLight.position.set(0.5, 12, 12);
  return [dirLight, pointLight, pointLight2];
};

export const RobotsModel = props => {
  const theme = useTheme();
  const { rgbBackground, themeId } = theme;
  const canvasRef = useRef();
  const rendererRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const sceneRef = useRef();
  const lightsRef = useRef();
  const materialRef = useRef();
  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();
  const robotModelRef = useRef();
  const animationsRef = useRef();
  const mixerRef = useRef(null);
  const clockRef = useRef(new Clock());

  // Setup three.js renderer, camera and controls
  useEffect(() => {
    if (isInViewport) {
      const { innerWidth, innerHeight } = window;

      const renderer = new WebGLRenderer({
        canvas: canvasRef.current,
        antialias: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true,
      });

      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(1.75);
      rendererRef.current = renderer;

      const camera = new PerspectiveCamera(47, innerWidth / innerHeight, 0.1, 1000);
      camera.position.set(-6.5, 2, 4);
      camera.rotation.set(degToRad(-10.15), degToRad(-50.65), degToRad(-10.83));
      cameraRef.current = camera;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.update();
      controls.enableZoom = false;
      controlsRef.current = controls;

      const scene = new Scene();
      sceneRef.current = scene;

      const material = new MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.28,
        wireframe: true,
      });
      materialRef.current = material;

      return () => {
        cleanScene(scene);
        cleanRenderer(renderer);
      };
    }
  }, [isInViewport]);

  // Add robot model
  useEffect(() => {
    if (isInViewport) {
      const robotModelLoader = modelLoader.setCrossOrigin('anonymous');
      robotModelLoader.load(robotModelPath, gltf => {
        gltf.scene.traverse(child => {
          if (child.isMesh) {
            child.material = materialRef.current;
          }
        });

        const robotModel = gltf.scene;
        robotModel.scale.set(1.55, 1.55, 1.55);
        robotModelRef.current = robotModel;

        const mixer = new AnimationMixer(robotModel);
        animationsRef.current = gltf.animations;
        mixer.clipAction(animationsRef.current[0]).play();
        mixer.clipAction(animationsRef.current[1]).play();
        mixerRef.current = mixer;

        sceneRef.current.add(robotModel);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      });
    }
  }, [isInViewport]);

  // Add lights to the scene
  useEffect(() => {
    if (sceneRef.current) {
      lightsRef.current = createLights(themeId);
      sceneRef.current.background = new Color(
        ...rgbToThreeColor(rgbBackground)
      ).convertSRGBToLinear();
      lightsRef.current.forEach(light => sceneRef.current.add(light));

      return () => {
        removeLights(lightsRef.current);
      };
    }
  }, [rgbBackground, themeId, isInViewport]);

  // Handle window resize
  useEffect(() => {
    if (rendererRef.current && cameraRef.current) {
      const { width, height } = windowSize;

      const adjustedWidth = width > 700 ? width / 2.5 : width / 1.2;
      rendererRef.current.setSize(adjustedWidth, height);
      cameraRef.current.aspect = adjustedWidth / height;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [windowSize, isInViewport]);

  // Animation loop
  useLayoutEffect(() => {
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (mixerRef.current) {
        mixerRef.current.update(clockRef.current.getDelta());
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    if (isInViewport) {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isInViewport]);

  return (
    <Transition in timeout={7000}>
      {visible => (
        <canvas
          aria-hidden
          className={styles.canvas}
          data-visible={visible}
          ref={canvasRef}
          {...props}
        />
      )}
    </Transition>
  );
};
