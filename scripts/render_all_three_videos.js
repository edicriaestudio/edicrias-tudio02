import { execSync } from 'child_process';
import fs from 'fs';

const TMP_DIR = '/tmp/figma_gen';
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

console.log('Generating high-resolution Figma template artboards...');
execSync('node scripts/generate_template_videos.js', { stdio: 'inherit' });

console.log('Rendering SVG artboards to PNG...');
execSync('ffmpeg -y -i /tmp/figma_gen/ophidia_board.svg /tmp/figma_gen/ophidia_board.png', { stdio: 'inherit' });
execSync('ffmpeg -y -i /tmp/figma_gen/atom_board.svg /tmp/figma_gen/atom_board.png', { stdio: 'inherit' });
execSync('ffmpeg -y -i /tmp/figma_gen/alodhx_board.svg /tmp/figma_gen/alodhx_board.png', { stdio: 'inherit' });

console.log('Rendering high performance, smooth 10s WebM videos with VP9...');

const renderVideo = (inputPng, outputWebm) => {
  const cmd = `ffmpeg -y -loop 1 -i ${inputPng} \
    -filter_complex "
      [0:v]format=yuv420p,
      scale=1280:2560,
      crop=w=1280:h=1706:x=0:y='(2560-1706)*(0.5 - 0.5*cos(2*PI*t/10))',
      scale=720:960
    " \
    -t 10 -r 30 -c:v libvpx-vp9 -b:v 2000k -crf 24 -pix_fmt yuv420p ${outputWebm}`;
  
  console.log(`Running: ${outputWebm}`);
  execSync(cmd, { stdio: 'inherit' });
};

renderVideo('/tmp/figma_gen/ophidia_board.png', 'public/figma/hero-ophidia-snake-luxury.webm');
renderVideo('/tmp/figma_gen/atom_board.png', 'public/figma/hero-atom-esg-sustainable.webm');
renderVideo('/tmp/figma_gen/alodhx_board.png', 'public/figma/hero-alodhx-water-tech.webm');

console.log('All 3 template videos successfully rendered and replaced!');
