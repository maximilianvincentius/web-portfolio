import { useParticles, useThreeScene } from '../hooks/usePortfolioEffects';

export default function BackgroundScene() {
  const canvasRef = useThreeScene();
  useParticles();
  return (
    <>
      <div className="canvas-cont"><canvas id="canvas3d" ref={canvasRef} /></div>
      <div id="particles-container"><canvas id="particles-canvas" /></div>
    </>
  );
}
