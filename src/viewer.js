window.LuxViewer=(()=>{
let scene,camera,renderer,group,frontMat,backMat,baseMat,host,textureCanvas,ctx,texture;
let dragging=false,lastX=0,lastY=0,targetY=-.34,targetX=.09,distance=9.3,editMode=false;
let objectColor='#f4f4f2',gridColor='#20242a',designImg=null,design={x:.5,y:.5,scale:1};
const W=1200,H=848;
function hex(c){return new THREE.Color(c)}
function drawGrid(){
 ctx.save();ctx.fillStyle=gridColor;ctx.textAlign='center';ctx.textBaseline='middle';
 const months=['ЯНВАРЬ','ФЕВРАЛЬ','МАРТ','АПРЕЛЬ','МАЙ','ИЮНЬ','ИЮЛЬ','АВГУСТ','СЕНТЯБРЬ','ОКТЯБРЬ','НОЯБРЬ','ДЕКАБРЬ'];
 const cols=4,rows=3,cellW=W/cols,cellH=H/rows;
 months.forEach((m,i)=>{const cx=(i%cols)*cellW,cy=Math.floor(i/cols)*cellH;ctx.font='700 18px Onest,Arial';ctx.fillText(m,cx+cellW/2,cy+25);ctx.font='500 12px Onest,Arial';ctx.globalAlpha=.82;ctx.fillText('П  В  С  Ч  П  С  В',cx+cellW/2,cy+51);ctx.font='400 12px Onest,Arial';for(let r=0;r<5;r++)ctx.fillText(`${r*7+1}   ${r*7+2}   ${r*7+3}   ${r*7+4}   ${r*7+5}   ${r*7+6}   ${r*7+7}`,cx+cellW/2,cy+78+r*27);ctx.globalAlpha=1});ctx.restore();
}
function redraw(){
 if(!ctx)return;ctx.clearRect(0,0,W,H);ctx.fillStyle=objectColor;ctx.fillRect(0,0,W,H);
 if(designImg){const iw=designImg.naturalWidth||designImg.width,ih=designImg.naturalHeight||designImg.height;const base=Math.min(W/iw,H/ih)*design.scale;const dw=iw*base,dh=ih*base;ctx.drawImage(designImg,design.x*W-dw/2,design.y*H-dh/2,dw,dh)}
 drawGrid();texture.needsUpdate=true;
}
function makeCalendar(){
 group=new THREE.Group();textureCanvas=document.createElement('canvas');textureCanvas.width=W;textureCanvas.height=H;ctx=textureCanvas.getContext('2d');texture=new THREE.CanvasTexture(textureCanvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
 frontMat=new THREE.MeshStandardMaterial({map:texture,roughness:.82,metalness:0});backMat=new THREE.MeshStandardMaterial({color:hex(objectColor),roughness:.84});baseMat=backMat.clone();
 const w=4.55,h=3.22,t=.055,angle=.42;
 const front=new THREE.Mesh(new THREE.BoxGeometry(w,h,t),frontMat);front.position.set(0,.62,.72);front.rotation.x=-angle;group.add(front);
 const back=new THREE.Mesh(new THREE.BoxGeometry(w,h,t),backMat);back.position.set(0,.62,-.72);back.rotation.x=angle;group.add(back);
 const floor=new THREE.Mesh(new THREE.BoxGeometry(w,.055,1.48),baseMat);floor.position.set(0,-.84,0);group.add(floor);
 scene.add(group);redraw();
}
function resize(){if(!renderer||!host)return;const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
function render(){if(!renderer)return;group.rotation.y+=(targetY-group.rotation.y)*.13;group.rotation.x+=(targetX-group.rotation.x)*.13;camera.position.z+=(distance-camera.position.z)*.14;renderer.render(scene,camera);requestAnimationFrame(render)}
function reset(){targetY=-.34;targetX=.09;distance=9.3}
function zoom(d){distance=Math.max(6.2,Math.min(13,distance+d))}
function setObjectColor(c){objectColor=c;backMat.color.set(c);baseMat.color.set(c);redraw()}
function setGridColor(c){gridColor=c;redraw()}
function setDesign(file){if(!file)return;const reader=new FileReader();reader.onload=e=>{const img=new Image();img.onload=()=>{designImg=img;design={x:.5,y:.5,scale:1};redraw()};img.src=e.target.result};reader.readAsDataURL(file)}
function setDesignScale(v){design.scale=Math.max(.2,Math.min(4,Number(v)));redraw()}
function setEditMode(v){editMode=!!v;host.classList.toggle('design-editing',editMode);const h=document.getElementById('viewerHelp');if(h)h.textContent=editMode?'Тяните изображение по календарю · колесо — масштаб изображения':'Потяните мышью, чтобы вращать · колесо — масштаб'}
function resetDesign(){design={x:.5,y:.5,scale:1};redraw()}
function snapshot(){renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png')}
function init(){host=document.getElementById('scene');scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(0,.5,distance);renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);scene.add(new THREE.HemisphereLight(0xffffff,0xaebdca,2.7));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(3,5,6);scene.add(key);makeCalendar();resize();render();window.addEventListener('resize',resize);
 host.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;host.setPointerCapture(e.pointerId)});
 host.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(editMode&&designImg){design.x+=dx/host.clientWidth*1.45;design.y+=dy/host.clientHeight*1.45;design.x=Math.max(-.3,Math.min(1.3,design.x));design.y=Math.max(-.3,Math.min(1.3,design.y));redraw()}else{targetY+=dx*.008;targetX+=dy*.005;targetX=Math.max(-.35,Math.min(.35,targetX))}lastX=e.clientX;lastY=e.clientY});
 host.addEventListener('pointerup',()=>dragging=false);host.addEventListener('pointercancel',()=>dragging=false);host.addEventListener('wheel',e=>{e.preventDefault();if(editMode&&designImg){design.scale*=e.deltaY>0?.92:1.08;design.scale=Math.max(.2,Math.min(4,design.scale));const slider=document.getElementById('designScale');if(slider)slider.value=Math.round(design.scale*100);redraw()}else zoom(e.deltaY>0?.4:-.4)},{passive:false});
 document.getElementById('zoomIn').onclick=()=>zoom(-.5);document.getElementById('zoomOut').onclick=()=>zoom(.5);document.getElementById('resetView').onclick=reset}
return{init,reset,setDesign,setObjectColor,setGridColor,setDesignScale,setEditMode,resetDesign,snapshot};})();