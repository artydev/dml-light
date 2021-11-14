
/* ----------------------------------------------------------------------------
    global variables
   ---------------------------------------------------------------------------- */

   var _base // Global element stores current insert position. If empty, elements are added at the end of document.
   var _baseStack = [] // Stack for storing _base positions
   var _block = false // global var for blocking loaders
   var _onresizeElements = [] // global list for onresize handlers
   
   /* ----------------------------------------------------------------------------
      constants
      ---------------------------------------------------------------------------- */
   
   const svgref = "http://www.w3.org/2000/svg";
   const PI2 = 2 * Math.PI
   const _style = "style"
   const _bold = "font-weight: bold;"
   const _italic = "font-style: italic;"
   const _fs = "font-size: "
   const _bigtext = "font-size: 130%;"
   const _bg = "background-color: "
   const _bgred = "background-color: red;"
   const _bgred2 = "background-color: #f50;"
   const _bgy = "background-color: #ffc;"
   const _bggreen = "background-color: #695;"
   const _bgblue = "background-color: blue;"
   const _bgorange = "background-color: #fc0;"
   const _bgsilver = "background-color: silver;"
   const _bgyellow = "background-color: #ffffee;"
   const _bgwhite = "background-color: white;"
   const _bgblack = "background-color: black;"
   const _bgtrans = "background-color: rgba(0,0,0,0.05);"
   const _bgwtrans = "background-color: rgba(255,255,255,0.5);"
   const _red = "color: red;"
   const _blue = "color: blue;"
   const _navy = "color: navy;"
   const _white = "color: white;"
   const _yellow = "color: yellow;"
   
   const _center = "text-align: center;"
   const _right = "text-align: right;"
   const _top = "vertical-align: top;"
   const _bottom = "vertical-align: bottom;"
   const _middle = "vertical-align: middle;"
   const _flexmiddle = "display: flex; align-items: center;"
   const _blur = "filter: blur(2px);"
   const _shadow = "box-shadow: 3px 3px 4px gray;"
   const _bigshadow = "box-shadow: 6px 6px 8px gray;"
   const _smallShadow = "box-shadow: 2px 2px 3px gray;"
   const _txtShadow = "text-shadow: 5px 6px 4px  rgba(0,0,0,0.44);"
   const _bigTxtShadow = "text-shadow: 8px 13px 5px  rgba(0,0,0,0.44);"
   const _border = "border: thin solid silver;"
   const _noborder = "border: 0px;"
   const _radius = "border-radius: 8px;"
   const _miniRadius = "border-radius: 5px;"
   const _padding = "padding: 2px;"
   const _tpadding = "padding: 1px 5px 1px 5px;"
   const _bigPadding = "padding: 10px;"
   const _smallMargin = "margin: 2px;"
   const _margin = "margin: 5px;"
   const _marginLeft = "margin-left: 5px;"
   const _marginRight = "margin-right: 5px;"
   const _bigMarginLeft = "margin-left: 10px;"
   const _bigMarginRight = "margin-right: 10px;"
   const _inShadow = "-webkit-box-shadow: inset 5px 5px 3px -2px rgba(0,0,0,0.64);" +
     "-moz-box-shadow: inset 5px 5px 3px -2px rgba(0,0,0,0.64);" +
     "box-shadow: inset 5px 5px 3px -2px rgba(0,0,0,0.64);"
   // Combined styles 
   const _box = _bgwhite + _border + _shadow
   const _ybox = _border + _shadow + _bg + "#ffc;"
   
   // Flex Layout definitions: At leas 3 columns without header
   const _bodyFlex = "display: flex; flex-flow: row nowrap; justify-content: space-between;"
   const _sideFlex = "flex-shrink: 0.5;" // side will shrink less
   const _columnFlex = "flex-grow: 0; display: flex;  flex-flow: row nowrap;"
   const _flex = "display: flex;"
   const _flexSpaceAround = "display: flex; justify-content: space-around;"
   const _flexSpaceBetween = "display: flex; justify-content: space-around;"
   // Use width: calc(100% - 200px); for expandable element
   const _sticky = "position: -webkit-sticky; position: sticky; top: 0px;"
   const _btnstyle = "width: 100px; height: 24px;" +
     "  display: inline-flex; align-items: center;" +
     " justify-content: center; margin: 8px;"
   const _flybox = "position: fixed;" +
     "padding: 6px;" +
     "box-shadow: 5px 5px 6px silver;" +
     "border-radius: 8px;" +
     "background-color: #ffffff;" +
     "border: thin solid gray;" +
     "left: 50%;" +
     "top: 50%;" +
     "transform: translate(-50%, -50%);"

   /*------------------------------------------------------

   
   /****************************************************************************************
   
       General Functions: 
       selectBase: select new base point for object creation
       popBase: restore previous base
       create: create free Elemtent
       appendBase: Add new element at base point
       make:   appendBase(create(typ, attrib, c))
         - typ: html-object type, e.g. "button"
         - attrib: array of attributes {"key":"value",...}
         - c: Text of object to appendBase, can be used for quick creation: make("div",{},"Hello world") => Div with content, c can be element
   
        
   ****************************************************************************************/
   
   /*------------------------------------------------------
     Select new base element for object creation 
     returns the new base for further usage, e.g.
     let myDiv = selectBase(div())
   
     saves old base with pushBase(), restore with popBase()
     Check Stack mismatch:
     let l = baseStackLength()
     SelectBase(...)
     ....
     unselectBase(l)
     ------------------------------------------------------*/
   function selectBase(ID) {
     // Save old base
     _baseStack.push(_base)
     if (_baseStack.length > 100) {
       alert("DML error: _baseStackOverflow in bushBase()")
       _baseStack = []
     }
     // select new base, either ID or element
     if (typeof (ID) === 'string')
       _base = document.getElementById(ID)
     else
       _base = ID
     return _base
   }
   
   function sb(ID) { selectBase(ID) } // Alias shortcut
   
   /*------------------------------------------------------
     read curent _base
     ------------------------------------------------------*/
   function getBase() {
     return _base
   }
   
   /*------------------------------------------------------
      get current stack position
     ------------------------------------------------------*/
   function DMLgetSP() {
     return _baseStack.length
   }
   
   /*------------------------------------------------------
     set Stackpointer for stored value
     ------------------------------------------------------*/
   function DMLsetSP(SP, msg = "DMLsetSP") {
     if (SP > _baseStack.length)
       alert("Error in " + msg + ", Stack pointer below desired SP")
     else
       while (_baseStack.length > SP)
         _base = _baseStack.pop()
     return _baseStack.length
   }
   
   /*------------------------------------------------------
      check, if current position is equal to chk
      chk is the stacklength before push, gives stack mismatch alert
     ------------------------------------------------------*/
   function DMLchkSP(oldCnt = 0, txt = "Missing unselectBase()") {
     if (DMLgetSP() != oldCnt)
       alert("DML error: _baseStack size mismatch - " + txt + ", before: " + oldCnt + ", after: " + DMLgetSP())
     return _baseStack.length
   }
   
   /*------------------------------------------------------
     Stack-Prüfung für Einzelfunktionen
     f: ()=>{return new construct(xyz) }
     ------------------------------------------------------*/
   function checkSP(f, txt) {
     let sp = DMLgetSP()
     let ret = f()
     DMLchkSP(sp, txt)
     return ret
   }
   
   /*------------------------------------------------------
      restore last base from stack, returns Stack position.
      if cnt set, unselectBase is called cnt times
      oldCnt is provided for test purpose. If SP after unselectBase
      is different, error message is displayed
     ------------------------------------------------------*/
   function unselectBase(cnt = 1, oldCnt = -1, msg = "unselectBase") {
     for (let i = 0; i < cnt; i++) {
       if (_baseStack.length <= 0) {
         alert("DML error: _baseStack empty in popBase()")
         break
       } else
         _base = _baseStack.pop() // restore old stack
   
       if (oldCnt >= 0) {
         if (DMLgetSP() != oldCnt)
           alert("DML error: _baseStack size mismatch - " + msg + ", before: " + oldCnt + ", after: " + DMLgetSP())
       }
     }
     // if chk, check Stacklength after pop == chk
     return _baseStack.length
   }
   
   
   /* ----------------------------------------------------------------------------
      Check, if node is element or string
      create span from string
      if c is object, return Object only
      ----------------------------------------------------------------------------*/
   function chk_node(c) {
     if (typeof (c) == "string") {
       let ret = create("span")
       ret.innerHTML = c
       return ret
       //  return textNode(c)
     } else return c
   }
   
   function textNode(s) {
     return document.createTextNode(s)
   }
   /* ----------------------------------------------------------------------------
      Set JSON array as element attributes:
      {"class":"test", "style":"color: red; display: none"}
      If only a string is provided as attrib, it is assumed to be a style definition
      so "color: red;" is converted to {"style":"color: red;"}
      style strings are disassembled and set via style.setProperty() to prevent unwanted
      overwrite of style attributes. 
   
      Style properties are always added, to remove use style.removeProperty()
      ---------------------------------------------------------------------------- */
   function setAttributes(el, attrib) {
     if (typeof (attrib) == "string") // Check for string attribute          
       attrib = { "style": attrib } // Convert strings to {"style",attrib}
   
     // set attributes
     if (typeof (attrib) == "object") {
       // Slpit JSON, set attributes individually
       Object.keys(attrib).forEach(function (key) {
         let val = attrib[key]
         if (key != "style") {
           el.setAttribute(key, val); // Normal attributes
         } else { // set Style parameters individually
           let ar = val.split(';'); // Split style Elements
           ar.forEach(function (pair) {
             if (pair) { // If not empty    
               let kv = pair.split(":")
               if (kv.length == 2) {
                 let p = kv[0].trim()
                 let v = kv[1].trim()
                 el.style.setProperty(p, v); // Set property
               }
             }
           })
         }
       })
     }
     return (el)
   }
   
   /*------------------------------------------------------
      general short cut function. Creates an element and appends
      to existing object. Type is string like 'div'
     ------------------------------------------------------*/
   function createAt(obj, typ, attrib) {
     let ret = document.createElement(typ)
     setAttributes(ret, attrib)
     obj.appendChild(ret)
     return ret
   }
   
   
   // ----------------------------------------------------------------------------
   // create object with content and attributes. Content can be text or object
   // attrib is an JSON-object {"id":"test", "class": myclass}
   // ----------------------------------------------------------------------------
   function create(typ, attrib, c) {
     let el = document.createElement(typ)
     if (c) {
       if (typeof (c) == 'string') el.innerHTML = c
       else el.appendChild(c); // sicherstellen, daß c objekttyp ist
     }
     if (attrib) { setAttributes(el, attrib) }
     return el
   }
   
   
   // ----------------------------------------------------------------------------
   // Append object at current base
   // ----------------------------------------------------------------------------
   function appendBase(c) {
     let e = chk_node(c)
     if (_base) _base.appendChild(e)
     else {
       // if (document.body) document.body.append(e)
       if (document.body) document.body.appendChild(e)
       else {
         console.log("null Body found: " + c.textContent)
         return
       }
     }
     return (e)
   }
   // ----------------------------------------------------------------------------
   // Append object at current base without check for String
   // ----------------------------------------------------------------------------
   function _appendBase(c) {
     if (_base)
       _base.appendChild(c)
     else
       document.body.append(c)
     return (c)
   }
   
   // ----------------------------------------------------------------------------
   // make: create element with content and appendBase at current base
   // attributes is an JSON-object {"id":"test", "class": myclass}
   // ----------------------------------------------------------------------------
   function make(typ, attrib, c) {
     return appendBase(create(typ, attrib, c))
   }
   


   

   /****************************************************************************************
     DML shortcut function definitions
   ****************************************************************************************/
   
   
   /* ============================================================================
      following functions use their name as argument: h1(text) creates  <h1> text </h1> 
      return object reference let b = button("test")
      ============================================================================ */
   
   function br(cnt) { let n = cnt || 1; let br; for (let i = 0; i < n; i++) br = make("br"); return br; } // br() or br(5) for one or multiple linebreaks
   function nbsp(n = 1) {
     let s = "";
     for (let i = 0; i < n; i++) { s += "\xa0" }
     print(s)
   }
   
   function h1(s, attrib) { return make("h1", attrib, s) }
   
   function h2(s, attrib) { return make("h2", attrib, s) }
   
   function h3(s, attrib) { return make("h3", attrib, s) }
   
   function h4(s, attrib) { return make("h4", attrib, s) }
   
   function h5(s, attrib) { return make("h5", attrib, s) }
   
   function h6(s, attrib) { return make("h6", attrib, s) }
   
   function hr(attrib) { return make("hr", attrib) }
   
   function p(s, attrib) { return make("p", attrib, s) }
   // function slider(attrib) { let sl = make("input", attrib); sl.type = "range"; return sl }
   function image(s, attrib) {
     let d = make("img", attrib);
     d.src = s, d.alt = s;
     return d;
   }
   
   function span(s, attrib) { return make("span", attrib, s) }
   
   function link(s, link, attrib) {
     let lnk = make("a", attrib, s);
     lnk.href = link;
     return lnk;
   }
   // Create link
   function pre(s, attrib) { return make("pre", attrib, textNode(s)); } // Unformatted text
   //function txt(s, attrib) { let d = make("pre", attrib, textNode(s)); d.style.display = "inline-block"; return d; }
   
   
   /*------------------------------------------------------
     Various DIV´s
     ------------------------------------------------------*/
   function div(s, attrib) {
     return make("div", attrib, s)
   }
   
   function idiv(s, attrib) {
     let d = make("div", attrib, s);
     // if (d) if (d.style)
     d.style.display = "inline-block";
     return d;
   }
   const inlineDiv = idiv; // Alias
   const inlinediv = idiv; // Alias
   
   // Create div and select as base 
   function sdiv(s, attrib) {
     return selectBase(div(s, attrib))
   }
   
   // create idiv and select as base
   function sidiv(s, attrib) {
     return selectBase(idiv(s, attrib))
   }
   
   /*------------------------------------------------------
     Create an overlay with an element of 0 px as an anchor
     returns the reference to the overlaying div
     requires unselectBase(2) 
     ------------------------------------------------------*/
   function overlay(s, attrib) {
     selectBase(div("", "position: relative; width: 0px; height: 0px;"))
     return selectBase(idiv(s, attrib))
   }
   
   
   
   /*------------------------------------------------------
      Create a button
     ------------------------------------------------------*/
   function button(s, attrib) {
     return make("button", attrib, s)
   }
   
   /*------------------------------------------------------
      Round button
     ------------------------------------------------------*/
   function rbutton(s, x, y, diameter, attr) {
     let b = button(s, attr)
     let style = b.style
     b.parentElement.style.position = "relative"
     style.position = "absolute"
     style.left = px(x)
     style.top = px(y)
     style.height = b.style.width = diameter + "px"
     style.borderRadius = trunc(diameter / 2) + "px"
     style.transform = "translate(-50%, -50%)"
     return b
   };
   
   /*------------------------------------------------------
      normal textarea, not expanding
     ------------------------------------------------------*/
   function textarea(content, attrib, placeholder) {
     let ta = make("textarea", attrib);
     if (placeholder) ta.placeholder = placeholder;
     if (content) ta.value = content;
     return ta
   } // multiline text input
   
   /*------------------------------------------------------
      create textarea, that expands vertically
     ------------------------------------------------------*/
   function expandableTextarea(content, attrib, placeholder) {
     let ta = textarea(content, attrib, placeholder)
     setAttributes(ta, {
       "rows": "1",
       "style": /*"border: none; background-color: rgba(0,0,0,0);"+*/ " box-sizing: border-box; overflow: hidden; min-height: 35px"
     })
     setAttributes(ta, attrib)
   
     ta.onchange = ta.onkeyup = ta.doResize = ta.autosize
     ta.autosize()
     // ta.autosize(); // run once on startup
     return ta
   }
   
   /*------------------------------------------------------
       rezise Textarea
     ------------------------------------------------------*/
   HTMLTextAreaElement.prototype.autosize = function () { // Expand Textarea
     let el = this
     setTimeout(function () {
       el.style.height = "22px"
       el.style.height = (el.scrollHeight) + "px"
     }, 1);
   }
   
   
   
   /*------------------------------------------------------
     Add text or element count times to current base 
     count (optional)
     ------------------------------------------------------*/
   function print(s, count = 1) {
     for (let i = 0; i < count; i++) {
       if (typeof (s) == 'string')
         appendBase(s)
       else
         if (i == 0)
           appendBase(s)
         else
           appendBase(s.cloneNode(true))
     }
   }
   
   /*------------------------------------------------------
      Add text or node + br() to the current base
      count (optional)
     ------------------------------------------------------*/
   function println(s, count = 1) {
     for (let i = 0; i < count; i++) {
       print(s)
       br()
     }
   }
   
   // ----------------------------------------------------------------------------
   // Create label with margins. Childbefore will insert element left of label
   // ----------------------------------------------------------------------------
   function label(s, attrib, childbefore) {
     let lbl = make("label", attrib, childbefore)
     if (typeof (s) == "string")
       lbl.appendChild(textNode(s))
     else
       lbl.appendChild(s)
     lbl.style.marginRight = "5px"
     lbl.style.marginLeft = "5px"
     return lbl
   }
   
   
   // ----------------------------------------------------------------------------
   // Create a text of constant width
   // ----------------------------------------------------------------------------
   function blocktext(s, width, attrib) {
     let sp = span(s)
     inlineDiv(sp, attrib).style.width = px(width)
     return (sp)
   }
   
   /* ----------------------------------------------------------------------------
   inputSelect(options, attrib, def) 
   Create an input slect field 
   def is the default index 
   
   Options can be two formats:
     inputSelect(["a","b","c"])
     inputSelect([{text:"a", value: 2},{text: "b", value: 2},{text: "c", value: 3}])
   
    ----------------------------------------------------------------------------*/
   function inputSelect(options, attrib, def) {
     let s = make("select", attrib)
     setAttributes(s, attrib)
     s.addOptions(options)
     if (def) s.selectedIndex = def
     return s
   }
   HTMLSelectElement.prototype.addOptions = function (options) { addProps(this, "option", options) }
   HTMLSelectElement.prototype.selectOptionByValue = function (txt) { // Select Field that contains txt
     let o
     for (let i = 0; i < this.options.length; i++) {
       o = this.options[i].textContent
       if (o.includes(txt)) {
         this.options.selectedIndex = i
         return
       }
     }
   }
   
   
   
   
   
   // ----------------------------------------------------------------------------
   // Create Checkbox with labgel s after CB, def is true/false
   // ----------------------------------------------------------------------------
   function checkbox(s, attrib, def) {
     let sel
     if (s && (s != "")) {
       sel = create("INPUT", attrib)
       sel.type = "checkbox"
       let lbl = label(s, attrib, sel)
     } else {
       sel = make("INPUT", attrib)
       sel.type = "checkbox"
     }
     sel.style.marginRight = "5px"
     sel.style.marginLeft = "5px"
     if (def)
       sel.checked = def
     return sel
   }
   
   
   // ----------------------------------------------------------------------------
   // Text Input with label: 1st Attribute for Label text, 2.nd Attrib for 
   // Input field 
   // ---------------------------------------------------------------------------- 
   function inputText(s, options = {}) { return new _inputText(s, options) }
   class _inputText {
     constructor(s, options = {}) {
       options = joinOver({
         baseAttrib: {},
         labelAttrib: {},
         inputAttrib: {},
         fieldWidth: [],
         doBreak: true
       }, options)
   
       this.label = null
       this.base = sidiv("", options.baseAttrib)
       if (s != "") {
         this.label = idiv(s, options.labelAttrib)
         if (options.fieldWidth[0])
           this.label.style.width = px(options.fieldWidth[0])
       }
       this.input = create("input", options.inputAttrib)
       if (options.fieldWidth[1])
         this.input.style.width = px(options.fieldWidth[1])
       this.base.appendChild(this.input)
       unselectBase()
       if (options.doBreak)
         br();
   
       this.input
       this.label
       this.base
   
     }
     get value() { return this.input.value }
     set value(w) { this.input.value = w }
   }
   // ----------------------------------------------------------------------------
   // Number Input with label: 1st Attribute for Label text, 2.nd Attrib for 
   // Input field 
   // ----------------------------------------------------------------------------
   function inputNumber(s, attrib, inpAttrib) {
     let result
     let d = inlineDiv()
     if (s != "") {
       let lbl = inlineDiv(s, attrib)
       d.appendChild(lbl)
     }
     result = make("input", inpAttrib)
     result.type = "number"
     d.appendChild(result)
     return result
   }
   
   /*------------------------------------------------------
   Create a message box
   ------------------------------------------------------*/
   function msgBox(s, attrib, callback) {
     let sp = DMLgetSP()
   
     let d = sidiv("", "text-align: center;" +
       "position: fixed;" +
       "padding: 6px;" +
       "box-shadow: 5px 5px 6px silver;" +
       "border-radius: 8px;" +
       "background-color: #ffffff;" +
       "border: thin solid gray;" +
       "left: 50%;" +
       "top: 50%;" +
       "transform: translate(-50%, -50%);" +
       "width: 250px")
   
     setAttributes(d, attrib)
     let workarea = sdiv(s)
   
     selectBase(d)
     button("ok", _btnstyle).onclick = () => {
       d.remove()
       if (callback)
         callback()
     }
     unselectBase(3)
     dragElement(d)
     DMLchkSP(sp, "msgBox")
   
     return workarea
   }
   
   /*------------------------------------------------------
   Create a message box
   ------------------------------------------------------*/
   function askBox(s, attrib, doYes, doNo) {
     let sp = DMLgetSP()
   
     let d = sidiv("", "text-align: center;" + _flybox + "width: 250px")
   
     setAttributes(d, attrib)
     let workarea = sdiv(s)
   
     selectBase(d)
     button("Yes", _btnstyle).onclick = () => {
       d.remove()
       if (doYes instanceof Function) doYes()
     }
     button("No", _btnstyle).onclick = () => {
       d.remove()
       if (doNo instanceof Function) doNo()
     }
     unselectBase(3)
     dragElement(d)
     DMLchkSP(sp, "msgBox")
   
     return workarea
   }
   

   
   /****************************************************************************************
                               Lists   
   ****************************************************************************************/
   /*------------------------------------------------------
     ul()
     Gets array of string or array of object[key] ul([opts])
       ul.items: get or set content
       ul.clear(): Clear list
       ul.add(): Add new elements to the list 
       ul.put(): Clear list befor add
     ------------------------------------------------------*/
   function ul(opts, attrib) {
     let lst = make("ul", attrib)
     lst.items = opts
     return lst
   }
   HTMLUListElement.prototype.add = function (opts) { if (opts) appendChilds(this, "li", opts) }
   HTMLUListElement.prototype.put = function (opts) { this.clear(); if (opts) appendChilds(this, "li", opts) }
   HTMLUListElement.prototype.clear = function () { this.innerHTML = "" }
   
   Object.defineProperty(
     HTMLUListElement.prototype, "items", {
     get: function () {
       let elem, ret = []
       for (let i in this.childNodes) {
         let n = this.childNodes[i]
         elem = n.innerHTML
         ret.push(elem)
       }
       return ret
     },
     set: function (opts) {
       this.clear()
       this.add(opts)
     }
   }
   )
