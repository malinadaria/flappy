/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (() => {

eval("const RAD = Math.PI / 180;\nconst scrn = document.getElementById(\"canvas\");\nconst context = scrn.getContext(\"2d\");\nscrn.tabIndex = 1;\nscrn.addEventListener(\"click\", () => {\n  switch (state.curr) {\n    case state.getReady:\n      state.curr = state.Play;\n      SFX.start.play();\n      break;\n    case state.Play:\n      bird.flap();\n      break;\n    case state.gameOver:\n      state.curr = state.getReady;\n      bird.speed = 0;\n      bird.y = 100;\n      pipe.pipes = [];\n      UI.score.curr = 0;\n      SFX.played = false;\n      break;\n  }\n});\n\nscrn.onkeydown = function keyDown(e) {\n  if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38) {\n    // Space Key or W key or arrow up\n    switch (state.curr) {\n      case state.getReady:\n        state.curr = state.Play;\n        SFX.start.play();\n        break;\n      case state.Play:\n        bird.flap();\n        break;\n      case state.gameOver:\n        state.curr = state.getReady;\n        bird.speed = 0;\n        bird.y = 100;\n        pipe.pipes = [];\n        UI.score.curr = 0;\n        SFX.played = false;\n        break;\n    }\n  }\n};\n\nlet frames = 0;\nlet dx = 2;\nconst state = {\n  curr: 0,\n  getReady: 0,\n  Play: 1,\n  gameOver: 2,\n};\nconst SFX = {\n  start: new Audio(),\n  flap: new Audio(),\n  score: new Audio(),\n  hit: new Audio(),\n  die: new Audio(),\n  played: false,\n};\nconst gnd = {\n  sprite: new Image(),\n  x: 0,\n  y: 0,\n  draw: function () {\n    this.y = parseFloat(scrn.height - this.sprite.height);\n    context.drawImage(this.sprite, this.x, this.y);\n  },\n  update: function () {\n    if (state.curr != state.Play) return;\n    this.x -= dx;\n    this.x = this.x % (this.sprite.width / 2);\n  },\n};\nconst bg = {\n  sprite: new Image(),\n  x: 0,\n  y: 0,\n  draw: function () {\n    y = parseFloat(scrn.height - this.sprite.height);\n    context.drawImage(this.sprite, this.x, y);\n  },\n};\nconst pipe = {\n  top: { sprite: new Image() },\n  bot: { sprite: new Image() },\n  gap: 85,\n  moved: true,\n  pipes: [],\n  draw: function () {\n    for (let i = 0; i < this.pipes.length; i++) {\n      let p = this.pipes[i];\n      context.drawImage(this.top.sprite, p.x, p.y);\n      context.drawImage(\n        this.bot.sprite,\n        p.x,\n        p.y + parseFloat(this.top.sprite.height) + this.gap\n      );\n    }\n  },\n  update: function () {\n    if (state.curr != state.Play) return;\n    if (frames % 100 == 0) {\n      this.pipes.push({\n        x: parseFloat(scrn.width),\n        y: -210 * Math.min(Math.random() + 1, 1.8),\n      });\n    }\n    this.pipes.forEach((pipe) => {\n      pipe.x -= dx;\n    });\n\n    if (this.pipes.length && this.pipes[0].x < -this.top.sprite.width) {\n      this.pipes.shift();\n      this.moved = true;\n    }\n  },\n};\nconst bird = {\n  animations: [\n    { sprite: new Image() },\n    { sprite: new Image() },\n    { sprite: new Image() },\n    { sprite: new Image() },\n  ],\n  rotatation: 0,\n  x: 50,\n  y: 100,\n  speed: 0,\n  gravity: 0.125,\n  thrust: 3.6,\n  frame: 0,\n  draw: function () {\n    let h = this.animations[this.frame].sprite.height;\n    let w = this.animations[this.frame].sprite.width;\n    context.save();\n    context.translate(this.x, this.y);\n    context.rotate(this.rotatation * RAD);\n    context.drawImage(this.animations[this.frame].sprite, -w / 2, -h / 2);\n    context.restore();\n  },\n  update: function () {\n    let r = parseFloat(this.animations[0].sprite.width) / 2;\n    switch (state.curr) {\n      case state.getReady:\n        this.rotatation = 0;\n        this.y += frames % 10 == 0 ? Math.sin(frames * RAD) : 0;\n        this.frame += frames % 10 == 0 ? 1 : 0;\n        break;\n      case state.Play:\n        this.frame += frames % 5 == 0 ? 1 : 0;\n        this.y += this.speed;\n        this.setRotation();\n        this.speed += this.gravity;\n        if (this.y + r >= gnd.y || this.collisioned()) {\n          state.curr = state.gameOver;\n        }\n\n        break;\n      case state.gameOver:\n        this.frame = 1;\n        if (this.y + r < gnd.y) {\n          this.y += this.speed;\n          this.setRotation();\n          this.speed += this.gravity * 2;\n        } else {\n          this.speed = 0;\n          this.y = gnd.y - r;\n          this.rotatation = 90;\n          if (!SFX.played) {\n            SFX.die.play();\n            SFX.played = true;\n          }\n        }\n\n        break;\n    }\n    this.frame = this.frame % this.animations.length;\n  },\n  flap: function () {\n    if (this.y > 0) {\n      SFX.flap.play();\n      this.speed = -this.thrust;\n    }\n  },\n  setRotation: function () {\n    if (this.speed <= 0) {\n      this.rotatation = Math.max(-25, (-25 * this.speed) / (-1 * this.thrust));\n    } else if (this.speed > 0) {\n      this.rotatation = Math.min(90, (90 * this.speed) / (this.thrust * 2));\n    }\n  },\n  collisioned: function () {\n    if (!pipe.pipes.length) return;\n    let bird = this.animations[0].sprite;\n    let x = pipe.pipes[0].x;\n    let y = pipe.pipes[0].y;\n    let r = bird.height / 4 + bird.width / 4;\n    let roof = y + parseFloat(pipe.top.sprite.height);\n    let floor = roof + pipe.gap;\n    let w = parseFloat(pipe.top.sprite.width);\n    if (this.x + r >= x) {\n      if (this.x + r < x + w) {\n        if (this.y - r <= roof || this.y + r >= floor) {\n          SFX.hit.play();\n          return true;\n        }\n      } else if (pipe.moved) {\n        UI.score.curr++;\n        SFX.score.play();\n        pipe.moved = false;\n      }\n    }\n  },\n};\nconst UI = {\n  getReady: { sprite: new Image() },\n  gameOver: { sprite: new Image() },\n  tap: [{ sprite: new Image() }, { sprite: new Image() }],\n  score: {\n    curr: 0,\n    best: 0,\n  },\n  x: 0,\n  y: 0,\n  tx: 0,\n  ty: 0,\n  frame: 0,\n  draw: function () {\n    switch (state.curr) {\n      case state.getReady:\n        this.y = parseFloat(scrn.height - this.getReady.sprite.height) / 2;\n        this.x = parseFloat(scrn.width - this.getReady.sprite.width) / 2;\n        this.tx = parseFloat(scrn.width - this.tap[0].sprite.width) / 2;\n        this.ty =\n          this.y + this.getReady.sprite.height - this.tap[0].sprite.height;\n        context.drawImage(this.getReady.sprite, this.x, this.y);\n        context.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);\n        break;\n      case state.gameOver:\n        this.y = parseFloat(scrn.height - this.gameOver.sprite.height) / 2;\n        this.x = parseFloat(scrn.width - this.gameOver.sprite.width) / 2;\n        this.tx = parseFloat(scrn.width - this.tap[0].sprite.width) / 2;\n        this.ty =\n          this.y + this.gameOver.sprite.height - this.tap[0].sprite.height;\n        context.drawImage(this.gameOver.sprite, this.x, this.y);\n        context.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);\n        break;\n    }\n    this.drawScore();\n  },\n  drawScore: function () {\n    context.fillStyle = \"#FFFFFF\";\n    context.strokeStyle = \"#000000\";\n    switch (state.curr) {\n      case state.Play:\n        context.lineWidth = \"2\";\n        context.font = \"35px Squada One\";\n        context.fillText(this.score.curr, scrn.width / 2 - 5, 50);\n        context.strokeText(this.score.curr, scrn.width / 2 - 5, 50);\n        break;\n      case state.gameOver:\n        context.lineWidth = \"2\";\n        context.font = \"40px Squada One\";\n        let sc = `SCORE :     ${this.score.curr}`;\n        try {\n          this.score.best = Math.max(\n            this.score.curr,\n            localStorage.getItem(\"best\")\n          );\n          localStorage.setItem(\"best\", this.score.best);\n          let bs = `BEST  :     ${this.score.best}`;\n          context.fillText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);\n          context.strokeText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);\n          context.fillText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);\n          context.strokeText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);\n        } catch (e) {\n          context.fillText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);\n          context.strokeText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);\n        }\n\n        break;\n    }\n  },\n  update: function () {\n    if (state.curr == state.Play) return;\n    this.frame += frames % 10 == 0 ? 1 : 0;\n    this.frame = this.frame % this.tap.length;\n  },\n};\n\ngnd.sprite.src = \"img/ground.png\";\nbg.sprite.src = \"img/BG.png\";\npipe.top.sprite.src = \"img/toppipe.png\";\npipe.bot.sprite.src = \"img/botpipe.png\";\nUI.gameOver.sprite.src = \"img/go.png\";\nUI.getReady.sprite.src = \"img/getready.png\";\nUI.tap[0].sprite.src = \"img/tap/t0.png\";\nUI.tap[1].sprite.src = \"img/tap/t1.png\";\nbird.animations[0].sprite.src = \"img/bird/b0.png\";\nbird.animations[1].sprite.src = \"img/bird/b1.png\";\nbird.animations[2].sprite.src = \"img/bird/b2.png\";\nbird.animations[3].sprite.src = \"img/bird/b0.png\";\nSFX.start.src = \"sound/start.mp3\";\nSFX.flap.src = \"sound/flap.mp3\";\nSFX.score.src = \"sound/score.mp3\";\nSFX.hit.src = \"sound/hit.mp3\";\nSFX.die.src = \"sound/die.mp3\";\n\nfunction gameLoop() {\n  update();\n  draw();\n  frames++;\n}\n\nfunction update() {\n  bird.update();\n  gnd.update();\n  pipe.update();\n  UI.update();\n}\n\nfunction draw() {\n  context.fillStyle = \"#30c0df\";\n  context.fillRect(0, 0, scrn.width, scrn.height);\n  bg.draw();\n  pipe.draw();\n\n  bird.draw();\n  gnd.draw();\n  UI.draw();\n}\n\nsetInterval(gameLoop, 20);\n\n\n//# sourceURL=webpack://bistsybird/./index.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./style.css":
/*!*********************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style.css ***!
  \*********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/noSourceMaps.js */ \"./node_modules/css-loader/dist/runtime/noSourceMaps.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);\n// Imports\n\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, `#canvas\n{\n    background-color:#30c0df;\n    border: 2px solid black;\n    display: block;\n    margin: auto;\n    padding: 0;\n    width: 40%;\n}`, \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://bistsybird/./style.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\nmodule.exports = function (cssWithMappingToString) {\n  var list = [];\n\n  // return the list of modules as css string\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = \"\";\n      var needLayer = typeof item[5] !== \"undefined\";\n      if (item[4]) {\n        content += \"@supports (\".concat(item[4], \") {\");\n      }\n      if (item[2]) {\n        content += \"@media \".concat(item[2], \" {\");\n      }\n      if (needLayer) {\n        content += \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\");\n      }\n      content += cssWithMappingToString(item);\n      if (needLayer) {\n        content += \"}\";\n      }\n      if (item[2]) {\n        content += \"}\";\n      }\n      if (item[4]) {\n        content += \"}\";\n      }\n      return content;\n    }).join(\"\");\n  };\n\n  // import a list of modules into the list\n  list.i = function i(modules, media, dedupe, supports, layer) {\n    if (typeof modules === \"string\") {\n      modules = [[null, modules, undefined]];\n    }\n    var alreadyImportedModules = {};\n    if (dedupe) {\n      for (var k = 0; k < this.length; k++) {\n        var id = this[k][0];\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n    for (var _k = 0; _k < modules.length; _k++) {\n      var item = [].concat(modules[_k]);\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        continue;\n      }\n      if (typeof layer !== \"undefined\") {\n        if (typeof item[5] === \"undefined\") {\n          item[5] = layer;\n        } else {\n          item[1] = \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\").concat(item[1], \"}\");\n          item[5] = layer;\n        }\n      }\n      if (media) {\n        if (!item[2]) {\n          item[2] = media;\n        } else {\n          item[1] = \"@media \".concat(item[2], \" {\").concat(item[1], \"}\");\n          item[2] = media;\n        }\n      }\n      if (supports) {\n        if (!item[4]) {\n          item[4] = \"\".concat(supports);\n        } else {\n          item[1] = \"@supports (\".concat(item[4], \") {\").concat(item[1], \"}\");\n          item[4] = supports;\n        }\n      }\n      list.push(item);\n    }\n  };\n  return list;\n};\n\n//# sourceURL=webpack://bistsybird/./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = function (i) {\n  return i[1];\n};\n\n//# sourceURL=webpack://bistsybird/./node_modules/css-loader/dist/runtime/noSourceMaps.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nvar stylesInDOM = [];\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n  for (var i = 0; i < stylesInDOM.length; i++) {\n    if (stylesInDOM[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n  return result;\n}\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var indexByIdentifier = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3],\n      supports: item[4],\n      layer: item[5]\n    };\n    if (indexByIdentifier !== -1) {\n      stylesInDOM[indexByIdentifier].references++;\n      stylesInDOM[indexByIdentifier].updater(obj);\n    } else {\n      var updater = addElementStyle(obj, options);\n      options.byIndex = i;\n      stylesInDOM.splice(i, 0, {\n        identifier: identifier,\n        updater: updater,\n        references: 1\n      });\n    }\n    identifiers.push(identifier);\n  }\n  return identifiers;\n}\nfunction addElementStyle(obj, options) {\n  var api = options.domAPI(options);\n  api.update(obj);\n  var updater = function updater(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {\n        return;\n      }\n      api.update(obj = newObj);\n    } else {\n      api.remove();\n    }\n  };\n  return updater;\n}\nmodule.exports = function (list, options) {\n  options = options || {};\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDOM[index].references--;\n    }\n    var newLastIdentifiers = modulesToDom(newList, options);\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n      var _index = getIndexByIdentifier(_identifier);\n      if (stylesInDOM[_index].references === 0) {\n        stylesInDOM[_index].updater();\n        stylesInDOM.splice(_index, 1);\n      }\n    }\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack://bistsybird/./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nvar memo = {};\n\n/* istanbul ignore next  */\nfunction getTarget(target) {\n  if (typeof memo[target] === \"undefined\") {\n    var styleTarget = document.querySelector(target);\n\n    // Special case to return head of iframe instead of iframe itself\n    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n      try {\n        // This will throw an exception if access to iframe is blocked\n        // due to cross-origin restrictions\n        styleTarget = styleTarget.contentDocument.head;\n      } catch (e) {\n        // istanbul ignore next\n        styleTarget = null;\n      }\n    }\n    memo[target] = styleTarget;\n  }\n  return memo[target];\n}\n\n/* istanbul ignore next  */\nfunction insertBySelector(insert, style) {\n  var target = getTarget(insert);\n  if (!target) {\n    throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n  }\n  target.appendChild(style);\n}\nmodule.exports = insertBySelector;\n\n//# sourceURL=webpack://bistsybird/./node_modules/style-loader/dist/runtime/insertBySelector.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction insertStyleElement(options) {\n  var element = document.createElement(\"style\");\n  options.setAttributes(element, options.attributes);\n  options.insert(element, options.options);\n  return element;\n}\nmodule.exports = insertStyleElement;\n\n//# sourceURL=webpack://bistsybird/./node_modules/style-loader/dist/runtime/insertStyleElement.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction setAttributesWithoutAttributes(styleElement) {\n  var nonce =  true ? __webpack_require__.nc : 0;\n  if (nonce) {\n    styleElement.setAttribute(\"nonce\", nonce);\n  }\n}\nmodule.exports = setAttributesWithoutAttributes;\n\n//# sourceURL=webpack://bistsybird/./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction apply(styleElement, options, obj) {\n  var css = \"\";\n  if (obj.supports) {\n    css += \"@supports (\".concat(obj.supports, \") {\");\n  }\n  if (obj.media) {\n    css += \"@media \".concat(obj.media, \" {\");\n  }\n  var needLayer = typeof obj.layer !== \"undefined\";\n  if (needLayer) {\n    css += \"@layer\".concat(obj.layer.length > 0 ? \" \".concat(obj.layer) : \"\", \" {\");\n  }\n  css += obj.css;\n  if (needLayer) {\n    css += \"}\";\n  }\n  if (obj.media) {\n    css += \"}\";\n  }\n  if (obj.supports) {\n    css += \"}\";\n  }\n  var sourceMap = obj.sourceMap;\n  if (sourceMap && typeof btoa !== \"undefined\") {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  }\n\n  // For old IE\n  /* istanbul ignore if  */\n  options.styleTagTransform(css, styleElement, options.options);\n}\nfunction removeStyleElement(styleElement) {\n  // istanbul ignore if\n  if (styleElement.parentNode === null) {\n    return false;\n  }\n  styleElement.parentNode.removeChild(styleElement);\n}\n\n/* istanbul ignore next  */\nfunction domAPI(options) {\n  if (typeof document === \"undefined\") {\n    return {\n      update: function update() {},\n      remove: function remove() {}\n    };\n  }\n  var styleElement = options.insertStyleElement(options);\n  return {\n    update: function update(obj) {\n      apply(styleElement, options, obj);\n    },\n    remove: function remove() {\n      removeStyleElement(styleElement);\n    }\n  };\n}\nmodule.exports = domAPI;\n\n//# sourceURL=webpack://bistsybird/./node_modules/style-loader/dist/runtime/styleDomAPI.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction styleTagTransform(css, styleElement) {\n  if (styleElement.styleSheet) {\n    styleElement.styleSheet.cssText = css;\n  } else {\n    while (styleElement.firstChild) {\n      styleElement.removeChild(styleElement.firstChild);\n    }\n    styleElement.appendChild(document.createTextNode(css));\n  }\n}\nmodule.exports = styleTagTransform;\n\n//# sourceURL=webpack://bistsybird/./node_modules/style-loader/dist/runtime/styleTagTransform.js?");

/***/ }),

/***/ "./style.css":
/*!*******************!*\
  !*** ./style.css ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleDomAPI.js */ \"./node_modules/style-loader/dist/runtime/styleDomAPI.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertBySelector.js */ \"./node_modules/style-loader/dist/runtime/insertBySelector.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ \"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertStyleElement.js */ \"./node_modules/style-loader/dist/runtime/insertStyleElement.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleTagTransform.js */ \"./node_modules/style-loader/dist/runtime/styleTagTransform.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!./node_modules/css-loader/dist/cjs.js!./style.css */ \"./node_modules/css-loader/dist/cjs.js!./style.css\");\n\n      \n      \n      \n      \n      \n      \n      \n      \n      \n\nvar options = {};\n\noptions.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());\noptions.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());\noptions.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, \"head\");\noptions.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());\noptions.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"], options);\n\n\n\n\n       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals : undefined);\n\n\n//# sourceURL=webpack://bistsybird/./style.css?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	__webpack_require__("./style.css");
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;