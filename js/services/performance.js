(() => {
  document.querySelectorAll('img').forEach(img=>{ if(!img.hasAttribute('loading')) img.loading='lazy'; img.decoding='async'; });
  // Add a subtle interaction to the global map without changing its asset.
  const map=document.querySelector('.map-card'); if(map){ map.addEventListener('pointermove',e=>{const r=map.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;const img=map.querySelector('img');if(img)img.style.transform=`translate(${x*10}px,${y*7}px) scale(1.04)`});map.addEventListener('pointerleave',()=>{const img=map.querySelector('img');if(img)img.style.transform=''})}
})();
