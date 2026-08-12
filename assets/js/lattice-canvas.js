/**
 * LATTICE CONSTRUCTION & DEVELOPMENT
 * Minimalist Interactive Diamond Lattice Canvas
 * Driven dynamically by tokens from assets/js/config.js
 */

(function() {
  'use strict';

  const canvas = document.getElementById('latticeHeroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let nodes = [];
  let mouse = { x: null, y: null, radius: 180 };

  const NODE_COUNT_DESKTOP = 38;
  const NODE_COUNT_MOBILE = 20;
  const CONNECTION_DISTANCE = 165;
  const TRUSS_TENSION_DISTANCE = 110;

  // Retrieve theme tokens from centralized config with fail-safe defaults
  const theme = window.LATTICE_CONFIG?.theme || {
    olive: '#6E7A4E',
    oliveRgb: '110, 122, 78',
    obsidian: '#272727',
    obsidianRgb: '39, 39, 39'
  };

  class StructuralNode {
    constructor(x, y) {
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * height;
      this.originX = this.x;
      this.originY = this.y;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 2;
      this.isPrimary = Math.random() > 0.65;
      this.isDiamond = Math.random() > 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.8;
          this.y -= Math.sin(angle) * force * 2.8;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);

      if (this.isDiamond) {
        const size = this.radius * 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size, 0);
        ctx.closePath();

        if (this.isPrimary) {
          ctx.fillStyle = theme.olive;
          ctx.fill();
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = theme.obsidian;
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${theme.oliveRgb}, 0.85)`;
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        
        if (this.isPrimary) {
          ctx.fillStyle = theme.obsidian;
          ctx.fill();
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = theme.olive;
          ctx.stroke();
        } else {
          ctx.fillStyle = theme.olive;
          ctx.fill();
        }
      }

      ctx.restore();
    }
  }

  function init() {
    resize();
    createNodes();
    animate();
  }

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  function createNodes() {
    nodes = [];
    const count = window.innerWidth < 768 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    for (let i = 0; i < count; i++) {
      nodes.push(new StructuralNode());
    }
  }

  function drawTrussNetwork() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - (dist / CONNECTION_DISTANCE));
          
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);

          if (dist < TRUSS_TENSION_DISTANCE) {
            ctx.strokeStyle = `rgba(${theme.oliveRgb}, ${alpha * 0.75})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();

            if ((i + j) % 3 === 0) {
              const midX = (nodes[i].x + nodes[j].x) / 2;
              const midY = (nodes[i].y + nodes[j].y) / 2;
              ctx.save();
              ctx.translate(midX, midY);
              ctx.beginPath();
              ctx.moveTo(0, -2.5);
              ctx.lineTo(2.5, 0);
              ctx.lineTo(0, 2.5);
              ctx.lineTo(-2.5, 0);
              ctx.closePath();
              ctx.fillStyle = `rgba(${theme.oliveRgb}, ${alpha * 0.9})`;
              ctx.fill();
              ctx.restore();
            }
          } else {
            ctx.strokeStyle = `rgba(${theme.oliveRgb}, ${alpha * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawTrussNetwork();

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    createNodes();
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
