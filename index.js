const initCubeSlider = (ops) => {
	var o = Object.assign({
				row: 2,
				col: 3,
				size: 100,
				unit: "px",
				interval: 2500,
				delay: 50,
				transition: 500,
				controls: false
			}, ops)
	var el = document.querySelector(o.el)
	var pel = el.parentNode
	
	var size = o.size
	var u = "px"
	
	var parcentage = function(t, p){
		return t * (p / 100)
	}
	if(o.unit === "%"){
		var ps = (pel && pel.clientWidth) || window.innerWidth
		el.style.fontSize = parcentage(ps, o.size) + "px"
		size = 1
		u = "em"
		window.addEventListener('resize', function(){
			ps = (pel && pel.clientWidth) || window.innerWidth
			el.style.fontSize = parcentage(ps, o.size) + "px"
		})
	}else{
		u = o.unit
	}
	
	var height = o.row * size
	var width = o.col * size
	
	el.style.height = height + u
	el.style.width = width + u
	
	var len = o.slides.length
	if(!len) return
	len = len < 7 ? len : 6
	
	var styles = [
		["translateZ(", ")"],
		["translateZ(-", ") rotateY(-90deg)"],
		["translateZ(-", ") rotateY(180deg)"],
		["translateZ(-", ") rotateY(90deg)"],
		["translateZ(-", ") rotateX(90deg)"],
		["translateZ(-", ") rotateX(-90deg)"]
	]
	
	var count = 1
	var render = undefined
	var showNext = function(){
		count++
		if(count > len){
			count = 1
		}
		var prev = count === 1 ? len : count - 1
		el.classList.remove("slide-" + prev)
		el.classList.add("slide-" + count)
	}
	var showPrev = function(){
		var prev = count === 1 ? len : count - 1
		el.classList.remove("slide-" + count)
		el.classList.add("slide-" + prev)
		count--
		if(count < 1){
			count = len
		}
	}
	var runSlider = function(){
		render = setInterval(showNext, o.interval)
	}
	
	var addControls = function(){
		var panel = document.createElement('div')
		panel.classList.add("ctrl-panel")
		
		var lctrl = document.createElement('span')
		lctrl.classList.add('ctrl')
		lctrl.classList.add('left')
		lctrl.addEventListener('click', function(){
			if(len === 1) return
			clearInterval(render)
			showPrev()
			render = setInterval(showNext, o.interval)
		})
		panel.appendChild(lctrl)
		
		var rctrl = document.createElement('span')
		rctrl.classList.add('ctrl')
		rctrl.classList.add('right')
		rctrl.addEventListener('click', function(){
			if(len === 1) return
			clearInterval(render)
			showNext()
			render = setInterval(showNext, o.interval)
		})
		panel.appendChild(rctrl)
		
		el.appendChild(panel)
	}
	
	var createCube = function(num, row, col){
		var cube = document.createElement('div')
		cube.classList.add('cube')
		cube.style.height = size + u
		cube.style.width = size + u
		cube.style.transition = "transform " + (o.transition / 1000) + "s"
		for(var i = 0; i < num; i++){
			var side = document.createElement('div')
			if(size !== 100 || u !== "px"){
				side.style.height = size + u
				side.style.width = size + u
				side.style.transform = styles[i][0] + (size / 2) + u + styles[i][1]
			}
			side.style.backgroundImage = "url(" + o.slides[i] + ")"
			side.style.backgroundSize  = (o.col * size) + u + " " + (o.row * size) + u
			side.style.backgroundPosition = "-" + (col * size) + u + " -" + (row * size) + u
			side.classList.add('side')
			cube.appendChild(side)
		}
		return cube
	}
	
	var init = function(){
		var c = 0
		for(var i = 0; i < o.row; i++){
			for(var j = 0; j < o.col; j++){
				var cube = createCube(len, i, j)
				cube.style.transitionDelay = (c * (o.delay / 1000)) + "s"
				el.appendChild(cube)
				c++
			}
		}
		
		
		if(len > 1){
			if(o.controls){
				addControls()
			}
			runSlider()
		}
	}
	init()
}

export default initCubeSlider