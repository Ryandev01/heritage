/*
*/

import { useGLTF } from '@react-three/drei'
import file_ from '../models/american_road_cliffside.glb'

export function Sample3dModel(props) {
  const { nodes, materials } = useGLTF(file_)
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[859.76, 71.2, 363.5]} rotation={[1.31, 0.98, 0.22]} />
        <mesh geometry={nodes.Material2.geometry} material={materials.Ground} />
        <mesh geometry={nodes.Material2_1.geometry} material={materials.Cliff} />
        <mesh geometry={nodes.Material2_2.geometry} material={materials.Road} />
      </group>
    </group>
  )
}

useGLTF.preload('/american_road_cliffside.glb')
