/* Copyright (C) 2013 Justin Windle, http://soulwire.co.uk */

(function (root, factory) {
  if (typeof exports === 'object') {
    // CommonJS like
    module.exports = factory(root, root.document)
  }
  else if (typeof define === 'function' && define.amd) {
    // AMD
    define(() => { return factory(root, root.document) })
  }
  else {
    // Browser global
    root.Sketch = factory(root, root.document)
  }
}(typeof window !== 'undefined' ? window : this, (window, document) => {
  'use strict'

  /*
  ----------------------------------------------------------------------

    Config

  ----------------------------------------------------------------------
  */

  const rAF = requestAnimationFrame
  const cAF = cancelAnimationFrame

  const MATH_PROPS = 'E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min'.split(' ')
  const HAS_SKETCH = '__hasSketch'
  const M = Math

  const CANVAS = 'canvas'
  const WEBGL = 'webgl'
  const DOM = 'dom'

  const doc = document
  const win = window

  const instances = []

  const defaults = {

    fullscreen: true,
    autostart: true,
    autoclear: true,
    autopause: true,
    container: doc.body,
    interval: 1,
    globals: true,
    retina: false,
    type: CANVAS,
  }

  const keyMap = {

    8: 'BACKSPACE',
    9: 'TAB',
    13: 'ENTER',
    16: 'SHIFT',
    27: 'ESCAPE',
    32: 'SPACE',
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
  }

  /*
  ----------------------------------------------------------------------

    Utilities

  ----------------------------------------------------------------------
  */

  function isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]'
  }

  function isFunction(object) {
    return typeof object == 'function'
  }

  function isNumber(object) {
    return typeof object == 'number'
  }

  function isString(object) {
    return typeof object == 'string'
  }

  function keyName(code) {
    return keyMap[code] || String.fromCharCode(code)
  }

  function extend(target, source, overwrite) {
    for (const key in source) {
      if (overwrite || !(key in target))

        target[key] = source[key]
    }

    return target
  }

  function proxy(method, context) {
    return function () {
      method.apply(context, arguments)
    }
  }

  function clone(target) {
    const object = {}

    for (const key in target) {
      if (key === 'webkitMovementX' || key === 'webkitMovementY')
        continue

      if (isFunction(target[key]))

        object[key] = proxy(target[key], target)

      else

        object[key] = target[key]
    }

    return object
  }

  /*
  ----------------------------------------------------------------------

    Constructor

  ----------------------------------------------------------------------
  */

  function constructor(context) {
    let request, handler, target, parent, bounds, index, suffix, clock, node, copy, type, key, val, min, max, w, h

    let counter = 0
    const touches = []
    let resized = false
    let setup = false
    const ratio = win.devicePixelRatio || 1
    const isDiv = context.type === DOM
    const is2D = context.type === CANVAS

    const mouse = {
      x: 0.0,
      y: 0.0,
      ox: 0.0,
      oy: 0.0,
      dx: 0.0,
      dy: 0.0,
    }

    const eventMap = [

      context.eventTarget || context.element,

      pointer,
      'mousedown',
      'touchstart',
      pointer,
      'mousemove',
      'touchmove',
      pointer,
      'mouseup',
      'touchend',
      pointer,
      'click',
      pointer,
      'mouseout',
      pointer,
      'mouseover',

      doc,

      keypress,
      'keydown',
      'keyup',

      win,

      active,
      'focus',
      'blur',
      resize,
      'resize',
    ]

    const keys = {}; for (key in keyMap) keys[keyMap[key]] = false

    function trigger(method) {
      if (isFunction(method))

        method.apply(context, [].splice.call(arguments, 1))
    }

    function bind(on) {
      for (index = 0; index < eventMap.length; index++) {
        node = eventMap[index]

        if (isString(node))

          target[`${on ? 'add' : 'remove'}EventListener`].call(target, node, handler, false)

        else if (isFunction(node))

          handler = node

        else target = node
      }
    }

    function update() {
      cAF(request)
      request = rAF(update)

      if (!setup) {
        trigger(context.setup)
        setup = isFunction(context.setup)
      }

      if (!resized) {
        trigger(context.resize)
        resized = isFunction(context.resize)
      }

      if (context.running && !counter) {
        context.dt = (clock = +new Date()) - context.now
        context.millis += context.dt
        context.now = clock

        trigger(context.update)

        // Pre draw

        if (is2D) {
          if (context.retina) {
            context.save()

            if (context.autoclear)
              context.scale(ratio, ratio)
          }

          if (context.autoclear)

            context.clear()
        }

        // Draw

        trigger(context.draw)

        // Post draw

        if (is2D && context.retina)

          context.restore()
      }

      counter = ++counter % context.interval
    }

    function resize() {
      target = isDiv ? context.style : context.canvas
      suffix = isDiv ? 'px' : ''

      w = context.width
      h = context.height

      if (context.fullscreen) {
        h = context.height = win.innerHeight
        w = context.width = win.innerWidth
      }

      if (context.retina && is2D && ratio) {
        target.style.height = `${h}px`
        target.style.width = `${w}px`

        w *= ratio
        h *= ratio
      }

      if (target.height !== h)

        target.height = h + suffix

      if (target.width !== w)

        target.width = w + suffix

      if (is2D && !context.autoclear && context.retina)

        context.scale(ratio, ratio)

      if (setup)
        trigger(context.resize)
    }

    function align(touch, target) {
      bounds = target.getBoundingClientRect()

      touch.x = touch.pageX - bounds.left - (win.scrollX || win.pageXOffset)
      touch.y = touch.pageY - bounds.top - (win.scrollY || win.pageYOffset)

      return touch
    }

    function augment(touch, target) {
      align(touch, context.element)

      target = target || {}

      target.ox = target.x || touch.x
      target.oy = target.y || touch.y

      target.x = touch.x
      target.y = touch.y

      target.dx = target.x - target.ox
      target.dy = target.y - target.oy

      return target
    }

    function process(event) {
      event.preventDefault()
      if (event.stopPropagation)
        event.stopPropagation()
      else
        event.cancelBubble = true

      copy = clone(event)
      copy.originalEvent = event

      if (copy.touches) {
        touches.length = copy.touches.length

        for (index = 0; index < copy.touches.length; index++)

          touches[index] = augment(copy.touches[index], touches[index])
      }
      else {
        touches.length = 0
        touches[0] = augment(copy, mouse)
      }

      extend(mouse, touches[0], true)

      return copy
    }

    function pointer(event) {
      event = process(event)
      min = (max = eventMap.indexOf(type = event.type)) - 1

      context.dragging

        = /down|start/.test(type)
          ? true

          : /up|end/.test(type)
            ? false

            : context.dragging

      while (min) {
        isString(eventMap[min])

          ? trigger(context[eventMap[min--]], event)

          : isString(eventMap[max])

            ? trigger(context[eventMap[max++]], event)

            : min = 0
      }
    }

    function keypress(event) {
      key = event.keyCode
      val = event.type === 'keyup'
      keys[key] = keys[keyName(key)] = !val

      trigger(context[event.type], event)
    }

    function active(event) {
      if (context.autopause)

        (event.type === 'blur' ? stop : start)()

      trigger(context[event.type], event)
    }

    // Public API

    function start() {
      context.now = +new Date()
      context.running = true
    }

    function stop() {
      context.running = false
    }

    function toggle() {
      (context.running ? stop : start)()
    }

    function clear() {
      if (is2D)

        context.clearRect(0, 0, context.width * ratio, context.height * ratio)
    }

    function destroy() {
      parent = context.element.parentNode
      index = instances.indexOf(context)

      if (parent)
        parent.removeChild(context.element)
      if (~index)
        instances.splice(index, 1)

      bind(false)
      stop()
    }

    extend(context, {

      touches,
      mouse,
      keys,

      dragging: false,
      running: false,
      millis: 0,
      now: Number.NaN,
      dt: Number.NaN,

      destroy,
      toggle,
      clear,
      start,
      stop,
    })

    instances.push(context)

    return (context.autostart && start(), bind(true), resize(), update(), context)
  }

  /*
  ----------------------------------------------------------------------

    Global API

  ----------------------------------------------------------------------
  */

  let element; let context; const Sketch = {

    CANVAS,
    WEB_GL: WEBGL,
    WEBGL,
    DOM,

    instances,

    install(context) {
      if (!context[HAS_SKETCH]) {
        for (let i = 0; i < MATH_PROPS.length; i++)

          context[MATH_PROPS[i]] = M[MATH_PROPS[i]]

        extend(context, {

          TWO_PI: M.PI * 2,
          HALF_PI: M.PI / 2,
          QUARTER_PI: M.PI / 4,

          random(min, max) {
            if (isArray(min))

              return min[~~(M.random() * min.length)]

            if (!isNumber(max)) { max = min || 1; min = 0 }

            return min + M.random() * (max - min)
          },

          lerp(min, max, amount) {
            return min + amount * (max - min)
          },

          map(num, minA, maxA, minB, maxB) {
            return (num - minA) / (maxA - minA) * (maxB - minB) + minB
          },
        })

        context[HAS_SKETCH] = true
      }
    },

    create(options) {
      options = extend(options || {}, defaults)

      if (options.globals)
        Sketch.install(self)

      element = options.element = options.element || doc.createElement(options.type === DOM ? 'div' : 'canvas')

      context = options.context = options.context || (function () {
        switch (options.type) {
          case CANVAS:

            return element.getContext('2d', options)

          case WEBGL:

            return element.getContext('webgl', options) || element.getContext('experimental-webgl', options)

          case DOM:

            return element.canvas = element
        }
      })();

      (options.container || doc.body).appendChild(element)

      return Sketch.augment(context, options)
    },

    augment(context, options) {
      options = extend(options || {}, defaults)

      options.element = context.canvas || context
      options.element.className += ' sketch'

      extend(context, options, true)

      return constructor(context)
    },
  }

  /*
  ----------------------------------------------------------------------

    Output

  ----------------------------------------------------------------------
  */

  return Sketch
}))
