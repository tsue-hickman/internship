import gsap from 'gsap'

export const animations = {
    fadeIn: (el) => gsap.fromTo(el, { opacity: 0, duration: 0.5} )
    slideIn: (el) => gsap.from(el, { x: -50, opacity: 0, duration: 0.5 }),
    bounce: (el) => gsap.from(el, { y: -10, repeat: -1, yoyo: true, duration: 1 })
}