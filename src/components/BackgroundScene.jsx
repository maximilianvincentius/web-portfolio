import { useParticles, useThreeScene } from '../hooks/usePortfolioEffects';

export default function BackgroundScene() {
  const canvasRef = useThreeScene();
  useParticles();
  return (
    <>
      <div className="fixed h-full left-10"><canvas id="canvas3d" ref={canvasRef} /></div>
      <div id="particles-container"><canvas id="particles-canvas" /></div>
    </>
  );
}
