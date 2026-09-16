window.LuxViewer = (() => {
  let scene, camera, renderer, group, designMaterial, host;
  let dragging=false,lastX=0,lastY=0,targetY=-.28,targetX=.08,distance=7.1;

  function makeCalendar(){
    group=new THREE.Group();
    const paper=new THREE.MeshStandardMaterial({color:0xfafafa,roughness:.78,metalness:0});
    designMaterial=paper.clone();
    const dark=new THREE.MeshStandardMaterial({color:0x263746,roughness:.65});
    const metal=new THREE.MeshStandardMaterial({color:0xaeb8c2,roughness:.28,metalness:.7});

    const w=4.15,h=2.93,t=.045,angle=.39;
    const front=new THREE.Mesh(new THREE.BoxGeometry(w,h,t),designMaterial);
    front.position.set(0,.72,.63); front.rotation.x=-angle; group.add(front);
    const back=new THREE.Mesh(new THREE.BoxGeometry(w,h,t),paper);
    back.position.set(0,.72,-.63); back.rotation.x=angle; group.add(back);
    const base=new THREE.Mesh(new THREE.BoxGeometry(w+0.18,.11,1.75),dark);
    base.position.y=-.72; group.add(base);
    const topBar=new THREE.Mesh(new THREE.BoxGeometry(w+.05,.12,.12),dark);
    topBar.position.set(0,2.04,0); group.add(topBar);

    for(let x=-1.75;x<=1.76;x+=.44){
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.12,.022,8,22,Math.PI*1.55),metal);
      ring.rotation.set(Math.PI/2,0,0); ring.position.set(x,2.09,.02); group.add(ring);
    }
    scene.add(group);
  }

  function resize(){
    if(!renderer||!host)return; const w=host.clientWidth,h=host.clientHeight;
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
  }
  function render(){
    if(!renderer)return; group.rotation.y+=(targetY-group.rotation.y)*.14; group.rotation.x+=(targetX-group.rotation.x)*.14;
    camera.position.z+=(distance-camera.position.z)*.15; renderer.render(scene,camera); requestAnimationFrame(render);
  }
  function reset(){targetY=-.28;targetX=.08;distance=7.1}
  function zoom(d){distance=Math.max(4.7,Math.min(10,distance+d))}
  function setDesign(file){
    if(!file)return; const reader=new FileReader(); reader.onload=e=>{
      new THREE.TextureLoader().load(e.target.result,tex=>{
        tex.colorSpace=THREE.SRGBColorSpace; tex.anisotropy=renderer.capabilities.getMaxAnisotropy();
        designMaterial.map=tex; designMaterial.color.set(0xffffff); designMaterial.needsUpdate=true;
      });
    }; reader.readAsDataURL(file);
  }
  function snapshot(){renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png')}
  function init(){
    host=document.getElementById('scene'); scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(38,1,.1,100); camera.position.set(0,.55,distance);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.shadowMap.enabled=true; host.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xffffff,0x9fb4c7,2.4)); const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(3,5,6);scene.add(key);
    makeCalendar(); resize(); render(); window.addEventListener('resize',resize);
    host.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;host.setPointerCapture(e.pointerId)});
    host.addEventListener('pointermove',e=>{if(!dragging)return;targetY+=(e.clientX-lastX)*.008;targetX+=(e.clientY-lastY)*.005;targetX=Math.max(-.35,Math.min(.35,targetX));lastX=e.clientX;lastY=e.clientY});
    host.addEventListener('pointerup',()=>dragging=false);host.addEventListener('pointercancel',()=>dragging=false);
    host.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY>0?.35:-.35)},{passive:false});
    document.getElementById('zoomIn').onclick=()=>zoom(-.45);document.getElementById('zoomOut').onclick=()=>zoom(.45);document.getElementById('resetView').onclick=reset;
  }
  return {init,reset,setDesign,snapshot};
})();