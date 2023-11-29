
/**
 * Steps to get jsx from 3d model ( .glb file ONLY used for now)
 * 1. get the .glb file in assets/model directory
 * 2. in the same directory, navigate via command prompt and run: npx gltfjsx model-name.glb
 * 3. If asks for confirmation to insatll gltfjsx, press y and proceed
 * 4. jsx would be generated in same directory
 * 5. import that component in this file, and apply styles as per you need
 * 
 * more reference: https://dev.to/nourdinedev/how-to-use-threejs-and-react-to-render-a-3d-model-of-your-self-4kkf
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Sample3dModel } from '../../assets/models/American_road_cliffside';

const ModelViewer = () => {
   return (
      <Canvas
         camera={{ position: [2, 0, 12.25], fov: 85 }}
         style={{
            backgroundColor: 'var(--black-90-pct)',
            width: '100%',
            height: 'auto',
            aspectRatio: '3/1.8',
            backgroundImage: 'radial-gradient(var(--search-bar-bg-color), var(--black-90-pct))'
         }}
      >
         <ambientLight intensity={1.25} />
         <ambientLight intensity={0.1} />
         <directionalLight intensity={0.4} />
         <Suspense fallback={null}>
            <Sample3dModel position={[0.025, -0.9, 0]} /> 
         </Suspense>
         <OrbitControls />
      </Canvas>
   );
}

export default ModelViewer
