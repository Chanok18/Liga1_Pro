import { useEffect, useRef } from 'react'

function drawPentagon(ctx, x, y, radius, rotation = -Math.PI / 2) {
  ctx.beginPath()
  for (let i = 0; i < 5; i += 1) {
    const angle = rotation + (i * Math.PI * 2) / 5
    const px = x + Math.cos(angle) * radius
    const py = y + Math.sin(angle) * radius
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

function createBallTexture(THREE) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(320, 260, 40, 512, 512, 680)
  gradient.addColorStop(0, '#f7f2f3')
  gradient.addColorStop(0.36, '#f7a9b4')
  gradient.addColorStop(0.64, '#18090c')
  gradient.addColorStop(1, '#050303')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = 'rgba(225, 72, 90, 0.54)'
  ctx.lineWidth = 9
  for (let i = -2; i <= 8; i += 1) {
    ctx.beginPath()
    ctx.moveTo(i * 160, 0)
    ctx.lineTo(i * 160 - 420, 1024)
    ctx.stroke()
  }

  const panels = [
    [512, 512, 112, 0],
    [238, 286, 92, 0.4],
    [794, 278, 86, -0.2],
    [256, 748, 86, 0.2],
    [754, 762, 96, -0.5],
    [512, 162, 74, 0.35],
    [512, 890, 70, -0.35],
  ]

  panels.forEach(([x, y, radius, rotation]) => {
    ctx.save()
    drawPentagon(ctx, x, y, radius, rotation)
    ctx.fillStyle = 'rgba(11, 6, 7, 0.88)'
    ctx.shadowColor = 'rgba(225, 72, 90, 0.76)'
    ctx.shadowBlur = 26
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.strokeStyle = 'rgba(247, 226, 229, 0.7)'
    ctx.lineWidth = 7
    ctx.stroke()
    ctx.restore()
  })

  ctx.globalCompositeOperation = 'screen'
  const shine = ctx.createRadialGradient(280, 180, 0, 280, 180, 360)
  shine.addColorStop(0, 'rgba(255, 255, 255, 0.75)')
  shine.addColorStop(0.44, 'rgba(225, 72, 90, 0.24)')
  shine.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = shine
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalCompositeOperation = 'source-over'

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

export function FootballBall3D() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    let cancelled = false
    let cleanup = () => {}

    import('three').then((THREE) => {
      if (cancelled) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
      camera.position.set(0, 0, 5.4)

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
      mount.appendChild(renderer.domElement)

      const ballGroup = new THREE.Group()
      scene.add(ballGroup)

      const texture = createBallTexture(THREE)
      const geometry = new THREE.SphereGeometry(1.35, 96, 96)
      const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.32,
        metalness: 0.18,
        clearcoat: 0.82,
        clearcoatRoughness: 0.18,
        emissive: new THREE.Color('#1f090d'),
        emissiveIntensity: 0.16,
      })
      const ball = new THREE.Mesh(geometry, material)
      ballGroup.add(ball)

      const wireGeometry = new THREE.SphereGeometry(1.365, 48, 48)
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: '#e1485a',
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      })
      const wire = new THREE.Mesh(wireGeometry, wireMaterial)
      ballGroup.add(wire)

      const ringGeometry = new THREE.TorusGeometry(1.85, 0.008, 8, 160)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: '#e1485a',
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      })
      const ringA = new THREE.Mesh(ringGeometry, ringMaterial)
      const ringB = new THREE.Mesh(ringGeometry.clone(), ringMaterial.clone())
      ringA.rotation.x = Math.PI * 0.5
      ringB.rotation.y = Math.PI * 0.62
      ballGroup.add(ringA, ringB)

      const ambient = new THREE.AmbientLight('#ffd0d6', 0.48)
      const key = new THREE.PointLight('#e1485a', 5.8, 12)
      key.position.set(2.5, 2.2, 3.5)
      const rim = new THREE.PointLight('#7dd3fc', 2.7, 10)
      rim.position.set(-3, -1.2, 2.4)
      scene.add(ambient, key, rim)

      const particleGeometry = new THREE.BufferGeometry()
      const particleCount = 220
      const positions = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 6
        positions[i * 3 + 1] = (Math.random() - 0.5) * 4.4
        positions[i * 3 + 2] = (Math.random() - 0.5) * 3
      }
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const particleMaterial = new THREE.PointsMaterial({
        color: '#e1485a',
        size: 0.018,
        transparent: true,
        opacity: 0.68,
        depthWrite: false,
      })
      const particles = new THREE.Points(particleGeometry, particleMaterial)
      scene.add(particles)

      const pointer = { x: 0, y: 0 }
      const onPointerMove = (event) => {
        const rect = mount.getBoundingClientRect()
        pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
        pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      }

      const resize = () => {
        const width = mount.clientWidth || 640
        const height = mount.clientHeight || 520
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }

      mount.addEventListener('pointermove', onPointerMove)
      window.addEventListener('resize', resize)
      resize()

      let frame = 0
      let raf = 0
      const animate = () => {
        frame += 0.01
        if (!reducedMotion) {
          ball.rotation.y += 0.006
          ball.rotation.x += 0.002
          wire.rotation.y -= 0.003
          ringA.rotation.z += 0.004
          ringB.rotation.x -= 0.003
          particles.rotation.y += 0.0016
        }

        ballGroup.rotation.y += (pointer.x * 0.24 - ballGroup.rotation.y) * 0.06
        ballGroup.rotation.x += (-pointer.y * 0.18 - ballGroup.rotation.x) * 0.06
        key.position.x = 2.5 + Math.sin(frame) * 0.8 + pointer.x
        key.position.y = 2.2 + Math.cos(frame * 0.8) * 0.6 - pointer.y

        renderer.render(scene, camera)
        raf = requestAnimationFrame(animate)
      }
      animate()

      cleanup = () => {
        cancelAnimationFrame(raf)
        mount.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('resize', resize)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
        texture.dispose()
        wireGeometry.dispose()
        wireMaterial.dispose()
        ringGeometry.dispose()
        ringA.material.dispose()
        ringB.geometry.dispose()
        ringB.material.dispose()
        particleGeometry.dispose()
        particleMaterial.dispose()
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement)
        }
      }
    })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <div className="football-canvas-shell" aria-hidden="true">
      <div ref={mountRef} className="football-canvas" />
    </div>
  )
}
